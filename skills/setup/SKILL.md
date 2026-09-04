---
description: >-
  Build a project's AI development harness from scratch. Interviews the
  maintainer about the product, stack, and verification reality, then writes
  CLAUDE.md, an agent roster with review gates, procedure skills, a docs
  record system, and day-one verification wiring (code gates, CI, release
  gate) tailored to the codebase. Run once when starting a new project or
  onboarding an existing repo to Claude Code.
argument-hint: "[what this project is (optional)]"
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
model: claude-opus-4-1
effort: high
---

# AI Engineering Infrastructure — Bootstrap

You are the first session in a brand-new project. Your job in this session is NOT to write
product code. It is to set up the AI engineering infrastructure — the project constitution
(CLAUDE.md), the agent roster, the skills, the documentation system, and the verification
gates — that every later session will work under. This infrastructure was distilled from a
desktop-app project in daily production use by its maintainer, which landed 60+ milestones
through these gates; the laws in `templates/CLAUDE.md` are not theory — nearly every one
was paid for by a real shipped defect or a corrupted review round, and the rest are
standing maintainer decrees from that project.

**What the user said this project is:** $ARGUMENTS

<!-- If that is empty, ask. If it is filled, treat it as the seed answer to Phase 0 Q1 and
     confirm it back rather than asking from zero. -->

**Templates.** The file shapes this session writes live in `templates/`, next to this file.
Read each one before writing its artifact, fill every `<placeholder>` from the interview
answers, and delete every HTML comment. A written file still containing a `<placeholder>`
or a template comment is a bug. The templates are:

| Template | Becomes |
| --- | --- |
| `templates/CLAUDE.md` | `CLAUDE.md` — the constitution, including the Laws |
| `templates/agent-brief.md` | one file per agent in `.claude/agents/` |
| `templates/gate-checklist.md` | `.claude/skills/gate-checklist/SKILL.md` |
| `templates/live-verification.md` | `.claude/skills/<harness-name>/SKILL.md` |
| `templates/MILESTONES.md` | `docs/MILESTONES.md` |
| `templates/BACKLOG.md` | `docs/BACKLOG.md` |
| `templates/DESIGN.md` | `docs/DESIGN.md` (UI projects only) |

**Scope boundary for this session.** On a greenfield project, a minimal buildable
scaffold — toolchain config, a hello-world entry point, one seed test — IS infrastructure
and in scope, because it is the substrate the verification gates run on. Feature/product
code is not in scope. If the user declines even a scaffold this session, each gate in
Phase 2.5 moves to `docs/BACKLOG.md` with the trigger "first scaffold commit", and Phase 3
records the gate-run as open, not waived.

**Harness assumption.** These instructions target the Claude Code harness (CLAUDE.md,
`.claude/agents/`, `.claude/skills/`). Confirm this in Phase 0. On a different harness,
map each artifact to that harness's real equivalent (its instructions file, its agent
registration format, its procedure/command format) before Phase 2, and keep the content
identical — an artifact in a shape the harness does not load is infrastructure that does
not exist.

Work in three phases, strictly in order. Generate NO artifact until Phase 1 is complete and
the user has confirmed the summary.

Conduct all conversation in the language the user writes in. Unless the user rules otherwise
in Phase 1, everything that lands in the repository — code, docs, commit messages, agent
briefs — is written in English.

---

## Phase 0 — Interview: what is being built

Ask in batches (≤4 questions per message, with recommended options where you can form one)
until you can answer ALL of the following. Never fill an answer by assumption — a wrong
foundation here compounds with every later session.

1. **Product.** What is it, in one paragraph? Who is the target user — be specific; persona
   shapes every priority (an expert user wants density and keyboard speed; a novice wants
   guidance).
2. **The competitive axis.** What ONE property must every decision be judged against?
   (speed/weight · correctness · security · DX · reliability · cost.) Every strong project
   has one weapon; if the user cannot name it, propose 2–3 candidates from the product
   description and make them choose. This single sentence becomes the test every future
   "should we add X" question is judged by.
3. **Stack.** Languages, frameworks, runtimes, package managers. Greenfield or existing
   scaffolding? Target platforms. Any machine-specific toolchain quirks already known
   (broken auto-detection, required env vars, proxy setups)?
4. **Architecture boundaries.** Is there a privileged/heavy layer vs a presentation layer?
   Write the hard rule: which logic lives where, what crosses the boundary, and in what
   shape (request/response vs push/streaming). This becomes the "if you are tempted to put
   X in Y, stop" rule.
5. **Radioactive material.** What is this project's sensitive data (credentials, tokens,
   PII, keys, user content)? What must never be logged, persisted, or serialized across the
   privilege boundary?
6. **UI.** Is there a visual surface a human will judge? Platforms/renderers? Theming
   (dark/light)? If yes, a design system and a design review gate are mandatory.
7. **Verification reality.** Can the real running artifact be driven programmatically
   (browser automation/CDP, CLI harness, API tests)? Is there a real environment (staging
   cluster, device, test account) sessions may use? What can ONLY a human verify?
8. **The shipped artifact.** What actually ships (binary, container, package, deploy)? Is
   it built differently from the dev artifact (release flags, embedded assets, different
   entry point)? If yes, a release-artifact gate is mandatory from day 1.
9. **Team.** Solo maintainer or team? Who signs off on what? What does the maintainer
   insist on judging personally (usually: visual quality, product direction)?
10. **Process preferences.** AI harness (confirm the Claude Code assumption above), commit
    convention, branching, CI platform, monorepo stance, licensing/privacy constraints.

## Phase 1 — Decision forks

Resolve each of these explicitly with the user, offering a recommendation. Do not proceed
past an unresolved fork.

- **F0 · Process weight.** The default is the full enterprise set below — all gates, CI,
  release gate, spec-first milestones. For a short-lived or low-stakes project the user
  may trim, but every trim is named WITH ITS COST in the Phase-1 summary and recorded in
  CLAUDE.md § Process decisions (e.g. "dropping the adversarial gate re-opens the standard
  cross-boundary failure: two sides green with the seam between them broken"). Never trim
  silently on the user's behalf.
- **F1 · Comment policy.** Options: (a) no comments in source, ever — intent lives in
  names/types/tests, reasoning lives in docs and commit messages (recommended for
  AI-heavy development: comments drift from code and every session pays for them in
  tokens; the source project deleted roughly 150,000 accumulated comment lines in one
  retrofit sweep — its commit diffstats 154,743 gross deleted lines — and the sweep
  needed a dedicated stripper, its own guard test, and a security-gate round to be
  complete; deciding on day 1 costs none of that); (b) sparse comments for non-obvious
  invariants only; (c) normal. For (a) and (b), the ONE exception is a tool directive
  whose grammar happens to be a comment — a shebang, a lint-suppression pragma, a
  type-suppression directive, a reference directive — carrying exactly what the tool
  requires and no prose beyond it. Decide NOW; for (a) or (b) generate a
  **directive-aware** guard test in Phase 2 (a naive "no comment syntax anywhere" guard
  goes RED on its own scaffold's shebang and gets weakened ad hoc — policy drift on day
  1); for (b), the guard enforces a mechanically decidable form — a required marker
  prefix on permitted comments, or a pinned per-file budget that may only shrink —
  chosen with the user, because "non-obvious invariants only" is not scanner-decidable;
  (c) needs no guard.
- **F2 · Delegation policy.** Is subagent use pre-approved as the standing default
  (recommended for solo maintainers: the orchestrator session scopes work, freezes
  contracts, integrates, and drives gates — it does not implement), or per-task?
- **F3 · Review gate set.** Default: security-reviewer + adversarial-reviewer mandatory
  before EVERY commit, design-reviewer additionally mandatory for any UI-visible change.
  State this default as the decided baseline, carry it into the Phase-1 summary for
  confirmation, and litigate alternatives only if the user pushes back (per F0, any
  removal is named with its cost).
- **F4 · Repo language.** English-only for everything that lands in the repo (recommended)?
- **F5 · Milestone process.** Spec-first with frozen contracts (recommended), or looser?
  Also fix the numbering scheme now — Law 13's live pointer is created in Phase 2.1.
- **F6 · Design process** (UI only). Mock-first for new visual anatomy (recommended: HTML
  mocks rendered and READ by the session before being shown, both themes, multiple
  widths), or direct-to-implementation? Mock-first requires a render-and-read instrument;
  if the tier-2 harness is deferred to BACKLOG, mock-first activates the moment the
  harness lands, and the constitution says so.
- **F7 · What the maintainer signs off personally.** List it; everything else must be
  verifiable by tier 1 or tier 2 (Law 6).

Then present a one-screen summary of every answer and every fork ruling — including the
gate set and any F0 trims with their named costs — and get an explicit confirmation
before Phase 2.

## Phase 2 — Generate the infrastructure

Generate the following, adapted to the interview answers. Every generated file is complete
and specific. The only permitted placeholders are after-first-feature items, and the mark
for one is always the same: a `docs/BACKLOG.md` entry naming its trigger condition.

### 2.1 CLAUDE.md — the constitution

Read `templates/CLAUDE.md` and write `CLAUDE.md` from it, adapted to this project. That
template carries the required section order, the 19 Laws, and the pre-commit checklist as
literal checkboxes — adapt the Laws' vocabulary to this stack, but do not renumber them
and do not drop one without recording the trim and its cost under § Process decisions.

Three things in that template are load-bearing and easy to get wrong:

- **The pre-commit checklist is in CLAUDE.md verbatim, as literal checkboxes.** The
  constitution is loaded into every session, and a checklist that lives only in an
  on-demand skill is not read by exactly the session that skips the gates.
- **Current status ends with the literal line `**Next free number: <M1>.**`**, spelled in
  the numbering scheme chosen at F5. This is the live pointer Law 13 names, and Law 13
  cites it by this file and heading.
- **Size budget — enforce it.** CLAUDE.md is loaded into every session; it must stay a
  constitution, not a history book. The Current-status section holds AT MOST one short
  paragraph per milestone plus a pointer to `docs/MILESTONES.md`; full as-built records
  live there and only there. The source project let its status section grow to roughly
  50,000 tokens that every session paid for. The template's corollary rule — **a doc line
  that mirrors state living elsewhere must name its source of truth or not exist** — is
  written into CLAUDE.md itself, because mirrored lines go stale silently (the source
  project shipped a line claiming its accent color was teal long after it wasn't, and a
  line calling a dead component "still live" more than a week after its deletion).

### 2.2 `.claude/agents/` — the roster

Read `templates/agent-brief.md`. Write one file per agent from it: one implementation agent
per architectural layer (named for the stack, e.g. `rails-backend`, `react-frontend`), plus
the review gates below. The template's frontmatter is Claude Code's REAL registration
format; on another harness, use whatever that harness actually loads. Its section headings
are fixed — the Phase-3 roster census guard asserts them.

Review agents are **read-only, enforced through the tool grant** (no write/edit tools), not
merely stated in prose — and every reviewer brief carries the template's read-only clause
verbatim, including its git-state sentence. (A reviewer in the source project stashed away
the very uncommitted change set it was reviewing, mid-run — recovered only because the
interruption was caught; "never edit" alone does not forbid it.)

- **security-reviewer** — sensitive-material handling, leak review across the privilege
  boundary, dependency audits. Verifies claims rather than trusting them.
- **adversarial-reviewer** — the final quality gate. Assumes the change is broken until
  the RUNNING artifact proves otherwise: runs the real code gates, drives the real
  app/service (via the tier-2 harness), hunts contract mismatches across boundaries that
  unit tests (which mock the boundary) structurally cannot catch. Reports ranked findings.
- **design-reviewer** (UI only) — reviews REAL rendered screenshots (all themes, realistic
  data, multiple widths), rejects generic template/AI-looking design on sight, audits
  information density against the best tools in the product's category, and prescribes
  concrete direction (exact hierarchy/sizes/spacing/what data to add) — never vague
  advice. Its prescriptions are proposals: the implementer may decline one **on
  measurement**, recording the number that refutes it.
- **field-qa** — the user's seat: the target persona fused with a QA professional, driving
  the real artifact through actual workflows. NOT a commit gate; invoked deliberately for
  whole-app sweeps; findings triaged by the maintainer.

### 2.3 `.claude/skills/` — codified procedures

- **live-verification harness skill** — write it from `templates/live-verification.md`.
  It is the tier-2 procedure for driving the real artifact (launch, attach, assert,
  screenshot), and its instrument-validation section is Law 8 made executable. If the stack
  has no artifact yet, still write the skill as a written procedure, with a BACKLOG entry
  whose trigger is "before the first UI/feature milestone".
- **boundary-crossing recipe skill** — a step-by-step recipe for adding one unit of the
  project's most repeated wiring (a new API endpoint end-to-end, a new IPC command, a new
  job type). Generate it as soon as the first instance exists; until then, a BACKLOG entry
  with that trigger.
- **gate-checklist skill** — write it from `templates/gate-checklist.md`. It is the
  executable mirror of the pre-commit checklist in CLAUDE.md § Agents & gates, and it names
  that section as its source of truth (per 2.1's mirrored-line rule). Fill its command
  table with this project's real commands.

### 2.4 `docs/` — the record system

- **`docs/MILESTONES.md`** — write from `templates/MILESTONES.md`. Specs and as-built
  records: spec → frozen contract (wire shapes, names, keys) → definition of done →
  as-built record → open items ("open, not waived"). This file, not CLAUDE.md, is where
  detail lives.
- **`docs/BACKLOG.md`** — write from `templates/BACKLOG.md`. Open items each with WHY it is
  open (blocked-on-what) and its trigger condition; declined decisions recorded with their
  reasons and the condition under which they'd be revisited; a future/v2 parking lot.
- **`docs/DESIGN.md`** (UI only) — write from `templates/DESIGN.md`. Tokens, type ladder,
  spacing, theming rules, and the accumulated visual LAWS section: every design-gate lesson
  is appended there as a rule with the measurement that created it, so the same defect
  cannot ship twice.
- A short `docs/DEV_ENVIRONMENT_SETUP.md` if Phase 0 Q3 surfaced any machine-specific
  setup.

### 2.5 Verification wiring — day one, not later

Several of these were retrofitted late in the source project at real cost — the release
gate arrived only after a release-only boot crash shipped under a fully green suite; the
harness's instrument validation only after nearly a month of silently cropped screenshots;
a code-gates CI workflow never existed there at all. Set them ALL up before the first
feature (or, under the scope boundary above, as BACKLOG entries triggered by the first
scaffold commit):

1. **Code gates wired and green on the scaffold**: format, lint (warnings are errors),
   typecheck, unit tests (the seed test keeps a zero-test runner from passing — or
   failing — vacuously), build — one command each, listed in CLAUDE.md. On an EXISTING
   codebase that cannot go warning-clean without product-code work, wire the gates with a
   pinned baseline that may only ratchet down (clean-on-changed-files, or a frozen
   warning count), and record the baseline number as an open item.
2. **CI from day 1**: the code gates + a dependency-audit workflow (SHA-pinned actions,
   weekly schedule).
3. **Release-artifact gate**: a script/spec that builds and EXECUTES the shipped artifact
   itself (not the dev flavor) and asserts it boots. The source project shipped a
   release-only boot crash under a fully green suite because dev and release were
   different binaries and nothing ever ran the release one.
4. **Live harness early**: stand it up before the first visual/feature milestone, and
   validate the instruments at install time — e.g. assert a screenshot captures the FULL
   viewport (the source project discovered every screenshot it had ever judged was
   silently cropped ~9%), and assert any event/IPC probe is provably live before trusting
   its "zero events" readings.
5. **Commit convention enforcement** (hook or CI) per the Phase-0 answers.
6. **`.gitignore` seeded for the radioactive material** named in Phase 0 Q5 (secret
   files, credential fixtures, local env files) — before the first commit, not after the
   first leak.

## Phase 3 — Close-out

After generating everything:

1. Run the code gates on the scaffold and show they are green (or show the BACKLOG
   entries if the scope boundary deferred them).
2. Prove two guards non-vacuous, RED-then-green, using planted fixture violations per
   Law 8: the **comment-policy guard** (skip if F1 chose "normal"), and the
   **agent-roster census guard** — a test that DISCOVERS every file in `.claude/agents/`
   and asserts each carries the required frontmatter fields, the required brief sections
   (the fixed headings in `templates/agent-brief.md`), and (for reviewers) a
   write-tool-free grant. The roster census has a real population the moment 2.2 runs, and
   it is this project's first Law-10 census; RED-prove it by planting a brief missing a
   required section. (If the scope boundary deferred the test runner itself, both proofs
   move to the same BACKLOG entries and are recorded as open, not waived.)
3. Verify each generated agent actually registers in the harness — list the roster the
   harness reports, not the files on disk. If the harness refreshes its agent roster
   only at session start, do not fail the close-out — hand the user the expected roster
   as a verify-first-thing item for their next session.
4. Write the after-first-feature items (harness wiring, recipe skill, release gate if no
   artifact exists yet) into BACKLOG.md, each with its trigger condition.
5. End with a one-screen map of every file created and what each is for. Recommend the
   user start their first real session by reading CLAUDE.md top to bottom once.
