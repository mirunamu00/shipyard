# Roadmap

Shipyard's milestones. This file is the source of truth for what gets built next;
the READMEs point here instead of restating it. Numbers are claimed from the live
pointer at the bottom, per keel's own Law 13.

Ordering principle: keel skills that pay off every cycle come before trigger-gated
work; a new plugin is opened only when its concern is genuinely different from
keel's (early phase) — lifecycle stage is the boundary, not feature count.

---

## M1 — Dogfood gates: CI and evals for shipyard itself

**Status:** CI shipped · evals open, not waived

**Why first.** This repo preaches day-one verification wiring and had none — the
exact finding `/keel:audit` would open with elsewhere. The marketplace that ships
the laws goes first.

### As-built — CI (done)

`.github/workflows/ci.yml` runs `scripts/validate.mjs` on every push to main, every
PR, and on demand. Zero dependencies, no secrets, no network: it is the same command
on a laptop and in CI. Seven checks:

| Check | What it catches |
| --- | --- |
| `marketplace` | manifest missing/invalid; a plugin `source` that does not resolve |
| `plugin` | plugin.json missing required fields; name disagreeing with its marketplace entry; non-semver version |
| `skill` | a skill with no `SKILL.md`, no frontmatter, or no `description` |
| `template` | a SKILL.md telling the session to read a `templates/<file>` that does not exist |
| `stale-ref` | leftover `mirunamu00/keel` / `keel@keel` from the pre-shipyard naming |
| `action-pin` | a GitHub Action referenced by mutable tag instead of a 40-char commit SHA |
| `version-bump` | a plugin's skills changed without its `version` changing — installed users would never see it |

**Non-vacuity (Law 8).** Every check was RED-proven against a planted violation
before being trusted, then reverted to green. Two results worth recording:

- `action-pin` **did not go red** on the first attempt. Its pattern was `^\s*uses:`,
  but real workflow steps are written `- uses:` — the check would have passed on
  every workflow forever. Fixed to `^\s*-?\s*uses:` and re-proven red on
  `actions/checkout@v4`, green on a SHA. This is the whole argument for RED-proof
  in one finding.
- A placeholder-leak check was written, then **deliberately removed**: in this repo
  the only files that may carry `<placeholder>` stubs are the templates, where they
  are correct, so the check had no valid population and would have passed vacuously.
  That responsibility lives in `/keel:audit` §1.5, where the population is real.
- `stale-ref` fired on the table above — the documentation *describing* the check
  names the old ids, and the first draft matched them. Narrowed to ignore inline
  code spans in Markdown while still scanning fenced blocks, since the real failure
  mode is a stale install command, not prose about one. Re-proven red twice: on a
  bare prose mention, and on an install command inside a fenced block.

**Process note, paid for once.** The gate was run as `node scripts/validate.mjs |
tail -2` inside a `&&` chain; the pipe replaced the script's exit code with `tail`'s,
so a red gate reported green and the commit went out anyway. Run gates unpiped, and
read the exit code — a gate whose failure cannot stop the commit is not a gate.

**Dependency audit.** This repo ships no runtime dependencies and has no
`package.json`; its dependency surface is the GitHub Actions it invokes. The
`action-pin` check is therefore this project's dependency audit, not a substitute
for one. If a runtime dependency is ever added, a real audit workflow becomes a new
milestone — do not quietly stretch `action-pin` to cover it.

### As-built — evals (done, via our own runner)

`claude plugin eval` is gated behind the server-side flag
`tengu_gb_eval_authed_enable` and is unavailable on this account — both
`eval init --bare` and `eval <target>` return "`plugin eval` is currently in early
access". Rather than wait, `scripts/eval.mjs` runs the same idea against the real
CLI with no dependency on that command.

Each case runs headlessly in a throwaway directory under an isolated
`CLAUDE_CONFIG_DIR`, with the plugin supplied by `--plugin-dir` from this working
tree — so the result reflects the code about to be pushed, not whatever is installed
on the machine. Cases are graded on the transcript **and** on the filesystem
afterwards, under `bypassPermissions`, so "wrote nothing" is a real observation
rather than a permission artifact.

| Case | What it proves |
| --- | --- |
| `setup-interviews-before-writing` | Phase 0/1 interviews and writes no file before confirmation |
| `setup-does-not-autofire` | a near-paraphrase of the skill description does not trigger it |
| `audit-reports-absent-harness` | reports the missing constitution, recommends setup, writes nothing |
| `audit-finds-planted-write-grant` | **finds a planted defect** — a `security-reviewer` seeded with a `Write` grant — and mutates nothing |

The last case is the one that matters: it does not watch for success, it plants the
violation `/keel:audit` exists to catch and requires it to be caught.

**Ablation.** Cases marked `ablate` rerun with the plugin absent. If the graders
still pass, the case is measuring the base model rather than this repo and is
reported `vacuous` — a failure, not a pass. Both audit cases were confirmed to fail
without the plugin.

**Cost.** Every case is a real API call, so this is not wired into CI by default.
Run it after prompt edits and before a release. Requires `ANTHROPIC_API_KEY`; the
runner refuses to fall back to the ambient config, because the ablation arm would
then still see an installed copy and every case would pass for the wrong reason.

### Open, not waived — the `$ARGUMENTS` grader

A grader asserting that `/keel:setup <description>` seeds Q1 instead of asking from
zero was written, failed, and was removed rather than left red or silently deleted.

**Measured, not assumed.** The transcript said "the invocation came with no project
description attached". A control run with the plugin **installed normally** and the
same prompt produced a fully Tauri-specific plan — app name, toolchain probe, WebView2
checks — so the behaviour works on the path users actually take. `$ARGUMENTS` does not
survive `--plugin-dir` under an isolated config, which is precisely the arrangement a
valid ablation requires.

A second control run meant to separate `--plugin-dir` from config isolation was
**inconclusive**: its output was filtered through a pattern match instead of being
kept, so nothing was left to read — this repo's own Law 2 violated while enforcing it.
It was not repeated, because neither answer changes the decision: under either cause
the eval harness cannot observe the behaviour, and the user-facing path is proven
working.

**Trigger.** The harness gains a way to deliver slash-command arguments under
`--plugin-dir`, or evals move to `claude plugin eval` once early access opens. Restore
the grader then; it is left commented in `evals/cases.mjs` with this reasoning.

## M2 — `/keel:milestone`

**Status:** planned

**Goal.** Open and close milestone records: claim the next number from the live
pointer in CLAUDE.md § Current status, scaffold the MILESTONES.md entry from the
template, and on close write the honest as-built record — measurements with their
where-and-how, open items as "open, not waived" — then update the pointer and the
one-paragraph status line.

**Why.** Laws 11, 12, and 13 are entirely manual today. This is the harness's
daily driver; it removes the most-repeated clerical work and the number-collision
risk at once.

**Done when.** A full open→close cycle on a real harnessed project produces a
record audit finds no fault with.

## M3 — `/keel:standards`

**Status:** planned

**Goal.** For an existing codebase: extract the conventions the code actually
follows (naming, module layout, error handling, idioms), confront the maintainer
with observed-vs-aspirational gaps, and write the result into CLAUDE.md as rules
each backed by a checkable guard — never prose alone.

**Why.** setup's interview works best greenfield; existing repos deserve rules
derived from evidence rather than memory. Strengthens the onboarding path.

**Done when.** Run against one real existing repo; every written rule names its
guard; at least one guard RED-proven against a planted violation.

## M4 — `/keel:decree`

**Status:** planned

**Goal.** Take one standing maintainer decree and land it in a single change:
recorded in CLAUDE.md § Standing decrees AND propagated into the brief of every
agent whose job could violate it, with the roster discovered from disk, not from
a hand-list.

**Why.** Law 19 done by hand means someone eventually updates the constitution
and forgets a brief — the drift audit exists to catch, prevented at the source.

**Done when.** A decree issued through the skill is found complete by
`/keel:audit` § 8 with zero findings.

## M5 — `/keel:refresh`

**Status:** blocked — trigger not met

**Trigger.** The first breaking revision of the setup templates. Until one
exists there is nothing to refresh from; building this earlier is speculation.

**Goal.** Diff an installed harness against the current templates, apply the
structural updates, and preserve project-specific content — with a report of what
changed and what was deliberately left.

## M6 — slipway (new plugin) — release engineering

**Status:** blocked — trigger not met

**Trigger.** A keel-harnessed project reaches its first real release.

**Goal.** The launchway: `/slipway:release` drives the release-artifact gate,
tags the release, and distills the changelog from MILESTONES.md as-built records
(records written honestly become release notes for free). A different lifecycle
stage from keel, so a sibling plugin, not a keel skill.

## M7 — drydock (new plugin) — mid-life survey and refit

**Status:** blocked — trigger not met

**Trigger.** Demand from keel adoption on existing, aging repos.

**Goal.** Where a vessel goes for inspection: `/drydock:survey` produces an
evidence-backed census of dependencies, dead code, and accumulated debt;
`/drydock:refit` turns accepted findings into BACKLOG entries with triggers and
executes the agreed slice. The lifecycle counterpart to keel — laid down early
vs. hauled out mid-life.

---

## Parking lot

Recorded so the reasoning isn't re-litigated (keel Law 11):

- **rigging** (hooks/MCP wiring plugin) — boundary with keel's verification
  wiring is blurry; revisit if wiring skills outgrow setup.
- **ballast** (test-depth hardening: property tests, coverage ratchets) — likely
  absorbable into drydock's survey/refit; keep separate only if it develops its
  own cadence.
- **berth** (contributor onboarding docs) — no demonstrated demand yet.

## Rejected

- **helm / compass** (product direction, roadmap tooling) — shipyard builds the
  structure a project stands on, not the product on top of it. Out of character,
  permanently.

---

**Next free number: M8.**
