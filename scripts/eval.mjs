#!/usr/bin/env node
// Eval runner for the shipyard plugins.
//
// Runs each case against the real CLI in a throwaway directory, with an
// ISOLATED config dir so the result reflects this working tree — not whatever
// happens to be installed on the machine. That isolation drops the CLI's
// stored login, so an ANTHROPIC_API_KEY is required. Without one this refuses
// to run rather than grading a contaminated environment: an eval that cannot
// tell the plugin from the ambient install reports "verified" for something it
// never measured, which is worse than no eval at all (Law 8).
//
//   node scripts/eval.mjs                 # all cases
//   node scripts/eval.mjs --case audit    # substring filter
//   node scripts/eval.mjs --no-ablation   # skip the without-plugin arm

import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const argv = process.argv.slice(2)
const arg = (n) => { const i = argv.indexOf(n); return i === -1 ? null : argv[i + 1] }
const filter = arg('--case')
const noAblation = argv.includes('--no-ablation')
const timeoutMs = Number(arg('--timeout') ?? 300_000)

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(`evals need ANTHROPIC_API_KEY.

Each case runs in an isolated CLAUDE_CONFIG_DIR so the plugin under test comes
from this working tree and the ablation arm is genuinely plugin-free. Isolation
drops the CLI's stored login, so a key is the only way to authenticate.

  export ANTHROPIC_API_KEY=sk-ant-...        # then: node scripts/eval.mjs

Refusing to fall back to the ambient config: the ablation arm would still see an
installed copy of the plugin, and every case would pass for the wrong reason.`)
  process.exit(2)
}

const cases = (await import(new URL('../evals/cases.mjs', import.meta.url))).default
  .filter((c) => !filter || c.name.includes(filter))

if (cases.length === 0) { console.error(`no cases match "${filter}"`); process.exit(2) }

const walk = (p, base = p) => readdirSync(p).flatMap((e) => {
  const f = join(p, e)
  return statSync(f).isDirectory() ? walk(f, base) : [relative(base, f).split('\\').join('/')]
})
const snapshot = (dir) => Object.fromEntries(
  walk(dir).map((f) => [f, createHash('sha1').update(readFileSync(join(dir, f))).digest('hex')]),
)

function runArm(c, withPlugin) {
  const work = mkdtempSync(join(tmpdir(), 'shipyard-eval-'))
  const cfg = join(work, '.cfg')
  const repo = join(work, 'repo')
  mkdirSync(cfg, { recursive: true })
  mkdirSync(repo, { recursive: true })

  for (const [rel, body] of Object.entries(c.seed ?? {})) {
    const dest = join(repo, rel)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, body)
  }

  const before = snapshot(repo)
  const args = ['-p', c.prompt, '--permission-mode', 'bypassPermissions']
  if (withPlugin) args.push('--plugin-dir', join(ROOT, c.plugin))

  const r = spawnSync('claude', args, {
    cwd: repo,
    encoding: 'utf8',
    timeout: timeoutMs,
    env: { ...process.env, CLAUDE_CONFIG_DIR: cfg },
    shell: process.platform === 'win32',
  })

  const after = snapshot(repo)
  const ctx = {
    stdout: `${r.stdout ?? ''}\n${r.stderr ?? ''}`,
    exitCode: r.status,
    timedOut: r.error?.code === 'ETIMEDOUT',
    created: Object.keys(after).filter((f) => !(f in before)),
    modified: Object.keys(after).filter((f) => f in before && after[f] !== before[f]),
  }

  rmSync(work, { recursive: true, force: true })
  return ctx
}

const results = []
for (const c of cases) {
  process.stdout.write(`\n${c.name}\n`)
  const withCtx = runArm(c, true)

  if (withCtx.timedOut) {
    console.log(`  ! timed out after ${timeoutMs / 1000}s — not graded`)
    results.push({ name: c.name, status: 'error' })
    continue
  }

  const graded = c.graders.map((g) => ({ ...g, pass: !!g.check(withCtx) }))
  for (const g of graded) {
    console.log(`  ${g.pass ? 'v' : 'x'} ${g.name}`)
    if (!g.pass) console.log(`      expected: ${g.why}`)
  }
  if (withCtx.created.length || withCtx.modified.length) {
    console.log(`      touched: ${[...withCtx.created, ...withCtx.modified].join(', ')}`)
  }

  // A failed grader is a claim about a transcript nobody can read. Keep it:
  // deciding whether the prompt or the grader is wrong needs the artifact
  // itself, not a pass/fail summary (Law 9).
  if (graded.some((g) => !g.pass) || argv.includes('--dump')) {
    const dest = join(ROOT, 'evals', 'results', `${c.name}.txt`)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, withCtx.stdout)
    console.log(`      transcript: ${relative(ROOT, dest).split('\\').join('/')}`)
  }

  let status = graded.every((g) => g.pass) ? 'pass' : 'fail'

  if (status === 'pass' && c.ablate && !noAblation) {
    const withoutCtx = runArm(c, false)
    const stillPasses = !withoutCtx.timedOut && c.graders.every((g) => !!g.check(withoutCtx))
    if (stillPasses) {
      console.log('  x ablation — graders also pass with the plugin absent; this case measures the base model')
      status = 'vacuous'
    } else {
      console.log('  v ablation — fails without the plugin, as it must')
    }
  }

  results.push({ name: c.name, status })
}

const tally = (s) => results.filter((r) => r.status === s).length
console.log(`\n${tally('pass')} passed · ${tally('fail')} failed · ${tally('vacuous')} vacuous · ${tally('error')} errored`)
process.exit(results.every((r) => r.status === 'pass') ? 0 : 1)
