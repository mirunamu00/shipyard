#!/usr/bin/env node
// Structural gate for the shipyard marketplace.
// Zero dependencies, no network, no auth — runs identically on a laptop and in CI.
// Complements `claude plugin validate .`, which checks manifest schema only:
// this also checks cross-manifest agreement, skill frontmatter, template
// existence, action pinning, stale references, and the version-bump rule.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const findings = []
const fail = (check, msg) => findings.push({ check, msg })
const rel = (p) => relative(ROOT, p).split('\\').join('/')

const read = (p) => readFileSync(p, 'utf8')
const readJson = (p, check) => {
  try { return JSON.parse(read(p)) } catch (e) { fail(check, `${rel(p)}: invalid JSON — ${e.message}`); return null }
}
const dirs = (p) => existsSync(p) ? readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory()) : []
const walk = (p) => existsSync(p) ? readdirSync(p).flatMap((e) => {
  const f = join(p, e)
  return statSync(f).isDirectory() ? walk(f) : [f]
}) : []

// ── 1. marketplace manifest ────────────────────────────────────────────────
const MP_PATH = join(ROOT, '.claude-plugin', 'marketplace.json')
if (!existsSync(MP_PATH)) fail('marketplace', 'missing .claude-plugin/marketplace.json')
const mp = existsSync(MP_PATH) ? readJson(MP_PATH, 'marketplace') : null

const pluginDirs = []
if (mp) {
  for (const f of ['name', 'description', 'owner', 'plugins']) {
    if (!mp[f]) fail('marketplace', `marketplace.json: missing required field "${f}"`)
  }
  if (!Array.isArray(mp.plugins) || mp.plugins.length === 0) {
    fail('marketplace', 'marketplace.json: "plugins" must be a non-empty array')
  }
  for (const entry of mp.plugins ?? []) {
    if (typeof entry.source !== 'string') { fail('marketplace', `plugin "${entry.name}": source must be a string path`); continue }
    const dir = join(ROOT, entry.source)
    if (!existsSync(dir)) { fail('marketplace', `plugin "${entry.name}": source "${entry.source}" does not exist`); continue }
    const manifest = join(dir, '.claude-plugin', 'plugin.json')
    if (!existsSync(manifest)) { fail('marketplace', `plugin "${entry.name}": missing ${rel(manifest)}`); continue }
    const pj = readJson(manifest, 'plugin')
    if (!pj) continue
    if (pj.name !== entry.name) {
      fail('plugin', `${rel(manifest)}: name "${pj.name}" disagrees with marketplace entry "${entry.name}"`)
    }
    for (const f of ['name', 'description', 'version', 'author']) {
      if (!pj[f]) fail('plugin', `${rel(manifest)}: missing required field "${f}"`)
    }
    if (pj.version && !/^\d+\.\d+\.\d+$/.test(pj.version)) {
      fail('plugin', `${rel(manifest)}: version "${pj.version}" is not semver`)
    }
    pluginDirs.push({ name: entry.name, dir })
  }
}

// ── 2. skills: frontmatter, and templates they reference ───────────────────
for (const { name, dir } of pluginDirs) {
  const skillsRoot = join(dir, 'skills')
  const skills = dirs(skillsRoot)
  if (skills.length === 0) fail('skill', `plugin "${name}": no skills under ${rel(skillsRoot)}`)
  for (const s of skills) {
    const skillDir = join(skillsRoot, s)
    const md = join(skillDir, 'SKILL.md')
    if (!existsSync(md)) { fail('skill', `${rel(skillDir)}: missing SKILL.md`); continue }
    const body = read(md)
    const fm = body.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fm) { fail('skill', `${rel(md)}: missing YAML frontmatter`); continue }
    if (!/^description:/m.test(fm[1])) fail('skill', `${rel(md)}: frontmatter has no "description"`)

    // Every templates/<file> the prompt tells the session to read must exist.
    const referenced = new Set([...body.matchAll(/`templates\/([A-Za-z0-9._-]+)`/g)].map((m) => m[1]))
    for (const t of referenced) {
      if (!existsSync(join(skillDir, 'templates', t))) {
        fail('template', `${rel(md)}: references templates/${t}, which does not exist`)
      }
    }
  }
}

// No placeholder-leak check here on purpose: in this repo the only files that
// may carry <placeholder> stubs are the templates, where they are correct. The
// check would have no valid population and would pass vacuously, which is worse
// than absent (Law 8). It lives in /keel:audit, which runs against harnesses
// where the population is real.

// ── 3. stale references from earlier repo/marketplace names ────────────────
const STALE = [/mirunamu00\/keel\b/, /keel@keel\b/]
for (const f of walk(ROOT).filter((p) => /\.(md|json|ya?ml|mjs)$/.test(p))) {
  const r = rel(f)
  if (r.startsWith('.git/') || r === 'scripts/validate.mjs') continue
  for (const re of STALE) {
    if (re.test(read(f))) fail('stale-ref', `${r}: stale reference matching ${re}`)
  }
}

// ── 4. dependency surface: GitHub Actions must be SHA-pinned ───────────────
// This repo ships no runtime dependencies; the actions it runs ARE its
// dependency surface, so pinning them is this project's dependency audit.
for (const f of walk(join(ROOT, '.github')).filter((p) => /\.ya?ml$/.test(p))) {
  // "- uses:" is the usual form; matching only "uses:" made this check vacuous.
  for (const [, ref] of read(f).matchAll(/^\s*-?\s*uses:\s*(\S+)/gm)) {
    if (ref.startsWith('./')) continue
    if (!/@[0-9a-f]{40}$/.test(ref)) fail('action-pin', `${rel(f)}: "${ref}" is not pinned to a 40-char commit SHA`)
  }
}

// ── 5. version-bump rule (only when given a base ref) ──────────────────────
// Changing a plugin's skills without bumping its version leaves installed
// users on the old copy with no signal — the failure the rule exists to stop.
const sinceIdx = process.argv.indexOf('--since')
if (sinceIdx !== -1) {
  const base = process.argv[sinceIdx + 1]
  let changed = []
  try {
    changed = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter(Boolean)
  } catch (e) {
    fail('version-bump', `cannot diff against "${base}" — ${e.message.split('\n')[0]}`)
  }
  for (const { name, dir } of pluginDirs) {
    const prefix = `${rel(join(dir, 'skills'))}/`
    if (!changed.some((c) => c.startsWith(prefix))) continue
    const manifestPath = rel(join(dir, '.claude-plugin', 'plugin.json'))
    let before
    try {
      before = JSON.parse(execFileSync('git', ['show', `${base}:${manifestPath}`], { cwd: ROOT, encoding: 'utf8' })).version
    } catch { continue } // new plugin in this range — nothing to compare
    const after = readJson(join(ROOT, manifestPath), 'version-bump')?.version
    if (before === after) {
      fail('version-bump', `plugin "${name}": skills changed but version stayed ${after} — installed users will never see it`)
    }
  }
}

// ── report ─────────────────────────────────────────────────────────────────
const CHECKS = ['marketplace', 'plugin', 'skill', 'template', 'stale-ref', 'action-pin', 'version-bump']
for (const c of CHECKS) {
  const hits = findings.filter((f) => f.check === c)
  const skipped = c === 'version-bump' && sinceIdx === -1
  console.log(`${skipped ? '-' : hits.length ? 'x' : 'v'} ${c}${skipped ? ' (skipped: no --since)' : hits.length ? ` — ${hits.length}` : ''}`)
  for (const h of hits) console.log(`    ${h.msg}`)
}

if (findings.length) {
  console.log(`\n${findings.length} finding(s).`)
  process.exit(1)
}
console.log(`\nAll checks passed. ${pluginDirs.length} plugin(s): ${pluginDirs.map((p) => p.name).join(', ')}.`)
