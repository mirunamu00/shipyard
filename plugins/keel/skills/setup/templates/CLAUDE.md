<!--
  keel:setup template — the project constitution.

  HOW TO USE THIS FILE
  - Fill every <placeholder> from the Phase 0/1 answers. A <placeholder> left in
    the written file is a bug.
  - Delete every HTML comment (including this one) before writing the file.
  - Keep the section order below. Adapt the Laws' vocabulary to this project's
    stack; never drop a law silently — a trim is recorded under
    "Process decisions" with its named cost (fork F0).

  SIZE BUDGET — ENFORCE IT
  This file is loaded into every session. It is a constitution, not a history
  book. "Current status" holds AT MOST one short paragraph per milestone plus a
  pointer to docs/MILESTONES.md; full as-built records live there and only there.
-->

# <Project Name>

<One paragraph: what the product is, and who the target user is — be specific,
the persona shapes every priority.>

**<The competitive axis, one sentence. Every "should we add X" decision is
judged against this.>**

## Architecture

<How the system is laid out, layer by layer.>

**The hard boundary rule.** <Which logic lives where, what crosses the boundary,
and in what shape (request/response vs push/streaming). Write it as a stop rule:
"If you are tempted to put <X> in <Y>, stop — it belongs in <Z> because <reason>."
>

## Tech stack

| Layer | Choice | Version | Why |
| --- | --- | --- | --- |
| <Language> | <...> | <...> | <...> |
| <Framework> | <...> | <...> | <...> |
| <Package manager> | <...> | <...> | <...> |
| <Test runner> | <...> | <...> | <...> |
| <Build / bundler> | <...> | <...> | <...> |

## Repo layout

```
<tree of the directories that exist, one line of purpose each>
```

## Development commands

| Purpose | Command |
| --- | --- |
| Install | `<...>` |
| Run (dev) | `<...>` |
| Format | `<...>` |
| Lint (warnings are errors) | `<...>` |
| Typecheck | `<...>` |
| Unit tests | `<...>` |
| Build | `<...>` |
| Build + run the SHIPPED artifact | `<...>` |

<Machine-specific quirks, if Phase 0 Q3 surfaced any: point to
docs/DEV_ENVIRONMENT_SETUP.md by path rather than restating them here.>

## Coding conventions

### <Language A>

- <Naming, module layout, error handling, the idioms this repo commits to.>

### <Language B>

- <...>

### Comments — <the F1 ruling, stated as a rule>

<For (a) no comments: "No comments in source, ever. Intent lives in names, types,
and tests; reasoning lives in docs and commit messages.">
<For (b) sparse: state the mechanically decidable form chosen with the user —
the required marker prefix, or the pinned per-file budget that may only shrink.>

**The one exception** is a tool directive whose grammar happens to be a comment —
a shebang, a lint-suppression pragma, a type-suppression directive, a reference
directive — carrying exactly what the tool requires and no prose beyond it.

Guard: `<command>` (`<path to the directive-aware guard test>`). It is
directive-aware by construction; if it goes RED on the scaffold's own shebang,
fix the guard, never the policy.

<Omit this entire subsection's guard paragraph if F1 chose (c) normal.>

## Security — the radioactive material

This project's radioactive material is: <credentials, tokens, PII, keys, user
content — the specific list from Phase 0 Q5>.

- Never logged, never serialized across the privilege boundary raw, never
  committed to the repository — no secret files, no real-credential fixtures.
  A private repo is not an excuse.
- <Redaction-first error surfaces: fixed strings over passthrough of upstream
  text.>
- <Least privilege; read paths before write paths.>
- Every change that touches it is reviewed by the security gate.

## Efficiency principles

<The 2–4 concrete, checkable rules the competitive axis implies. Each must be
checkable, not aspirational — name the measurement and where it is recorded.>

1. <...>
2. <...>

## Commit conventions

<Format, e.g. Conventional Commits: `type(scope): subject`.>

- Enforced by: `<hook or CI job>`.
- <Branching model.>
- Commit messages are written in <English, per fork F4>.

## Agents & gates

### Roster

| Agent | Role | Invoked |
| --- | --- | --- |
| `<impl-agent-per-layer>` | <...> | <...> |
| `security-reviewer` | Sensitive-material handling, leak review across the privilege boundary, dependency audits | Every commit |
| `adversarial-reviewer` | Final quality gate — assumes the change is broken until the running artifact proves otherwise | Every commit |
| `design-reviewer` | Real rendered screenshots, all themes, realistic data, multiple widths | Every UI-visible change |
| `field-qa` | The target persona fused with a QA professional, driving real workflows | Deliberately, for whole-app sweeps — NOT a commit gate |

Delegation policy: <the F2 ruling>.

### Pre-commit checklist

<!-- SOURCE OF TRUTH. The gate-checklist skill mirrors this block and names this
     heading as its source. Edit here first. -->

- [ ] `security-reviewer` ran on this change set
- [ ] `adversarial-reviewer` ran on this change set
- [ ] Every finding is addressed in this pass — nothing deferred (Law 4)
- [ ] Fixes to findings were re-reviewed (Law 5)
- [ ] UI-visible change → `design-reviewer` ran, on real rendered screenshots
- [ ] Code gates green: format, lint, typecheck, unit tests, build
- [ ] Comment-policy guard green
- [ ] Live proof exists: the real running artifact demonstrated the change working
- [ ] Release gate green if the shipped artifact's inputs changed (Law 7)
- [ ] Any new guard/test was proven RED before it was believed (Law 8)

### Process decisions

<Every F0 trim, named WITH ITS COST. Example:
"Adversarial gate dropped for this project (short-lived internal tool). Cost:
re-opens the standard cross-boundary failure — two sides green with the seam
between them broken."
If nothing was trimmed, write: "Full gate set, no trims.">

### <Maintainer name> signs off personally on

<The F7 list. Everything not on it must be verifiable by tier 1 or tier 2
(Law 6).>

### Standing decrees

<Law 19: standing maintainer constraints — a file that must never be edited, an
approach permanently ruled out. Each one recorded here AND carried, in the same
change, into the brief of every agent whose job could violate it. If there are
none yet, write: "None yet.">

## The Laws

<!-- Adapt vocabulary to this stack; keep the numbering and the substance. -->

1. **Two mandatory review gates before every commit** — security + adversarial,
   run in parallel, BEFORE the commit. They compose; neither replaces the other.
   Never risk-gated: "this is frontend-only" and "green tests are enough" have
   both shipped real regressions. Green code gates are necessary but not
   sufficient — a live run of the real artifact must also demonstrate the feature
   working. UI-visible change → the design gate too, before the maintainer's
   visual sign-off.
2. **Gates review the product, never the maintainer's tooling.** `.claude/**` and
   AI config are out of scope; scoping the review range is the orchestrator's job.
3. **Artifact-driving gates run serially.** Two agents driving one running
   app/service/device corrupt each other's sessions and produce phantom findings.
   Source-only reviewers may run alongside one driver.
4. **No deferred follow-ups.** A discovered defect is fixed in the same pass and
   recorded as done. Deferral is allowed only when genuinely blocked on something
   external, and the record must say why. A deferred-defect backlog is
   incompatible with a release bar of "nothing left to fix after actively
   hunting."
5. **Fixes are re-reviewed.** Gates re-run on the fix delta; several of the worst
   defects were introduced by fixes to earlier findings.
6. **Verification tiers — assign every check to the LOWEST tier able to run it.**
   Tier 1: code gates (the default home; grow these first). Tier 2: AI-driven
   live verification against the real artifact. Tier 3: human checks — its lists
   may contain ONLY what tiers 1–2 genuinely cannot run (subjective visual
   quality, native-OS surfaces, credentialed external auth).
7. **The shipped artifact is a different artifact.** At least one gate executes
   the release build directly. Any change to its inputs re-runs that gate.
8. **Instruments must be provably non-vacuous.** A new guard/test/spec is proven
   RED against the defect (or a staged mutation — CONFIRMED to be present in the
   artifact the guard reads before the RED run is believed; a mutation that
   silently failed to apply proves nothing) before it counts as protection; a
   probe asserts it is itself installed/live before any zero-reading is believed;
   an instrument that can pass — or fail — vacuously is worse than none, because
   it converts "unverified" into "verified" in the record. When a live spec
   fails, first ask whether the spec's model of the app is stale, then whether
   the app is broken.
9. **The dominant defect species is a claim its own artifact falsifies** — copy
   contradicting the data beside it, a doc asserting what the code doesn't do, a
   published number nobody measured, a green test proving something weaker than
   its name. Defense: read the artifact itself (DOM, raster, wire, binary, built
   output), never a summary of it; every recorded number states where and how it
   was measured; a width/color/figure is only valid at the size, face, and theme
   that produced it.
10. **Prefer structural guarantees over discipline.** Make wrong states
    unrepresentable: types over conventions, private constructors over "remember
    to sanitize", census tests that DISCOVER call sites from source over
    hand-maintained lists (a hand-list is wrong the day someone adds a caller),
    source-assertion guards for wiring/topology facts unit tests cannot see
    (provider nesting, import cycles, real registration). Test the REAL
    composition: two sides green with the seam between them broken is the
    standard cross-boundary failure.
11. **Records are honest.** As-built records state what was NOT run ("open, not
    waived"). A review prescription may be declined only on measurement, with the
    number recorded. Negative results (approaches tried and rejected) are recorded
    with reasons so no session repeats the experiment. The documentation bar:
    record a fact only if a fresh session would otherwise do the wrong thing;
    record it where a reader can be pointed by path and heading, in 1–3 sentences,
    at the place where that topic already lives.
12. **Spec-first milestones with frozen contracts.** Before parallel agents build,
    freeze the contract between them (wire/API shapes, event names, column keys)
    in `docs/MILESTONES.md`. The orchestrator session scopes, freezes, integrates,
    and drives gates; implementation is delegated. While a gate runs, do work that
    cannot conflict with it — never end a turn having only described the next
    action.
13. **Milestone numbers come from one live pointer** — the `Next free number` line
    at the end of `CLAUDE.md` § Current status (this file, that heading). Read and
    update it at claim time, after syncing with the remote once one exists.
    Renumbering after references accumulate costs more each day.
14. **Radioactive material** (§ Security above): never logged, never crosses the
    privilege boundary raw, never committed to the repository — no secret files,
    no real-credential fixtures; a private repo is not an excuse — redaction-first
    error surfaces (fixed strings over passthrough of upstream text), least
    privilege, read paths before write paths, and review by the security gate for
    every change that touches it.
15. **Efficiency laws derived from the competitive axis** — the rules in
    § Efficiency principles above are binding, and each is checkable, not
    aspirational.
16. **Encoding-safe writes.** Never generate or repair source files through shell
    redirection/pipes on Windows — it silently mangles non-ASCII. Use editor
    tooling.
17. **Design lessons become laws** (UI only). Every design-gate finding worth
    keeping is appended to `docs/DESIGN.md` as a rule with its measurement. New
    visual anatomy gets a mock that the session renders and READS before showing.
    Motion is only spent where it can be seen; a comparison surface leads with the
    comparison; a recovery promise is a claim the code must keep.
18. **When two facts disagree, measure; when a measurement and a memory disagree,
    the measurement wins** — and the corrected record replaces the wrong one in
    place, stating what was wrong and how it was found, not appended beside it.
19. **A standing maintainer decree binds the agents that could violate it.** When
    the maintainer issues a standing constraint (a file that must never be edited,
    an approach that is permanently ruled out), it is recorded in § Standing
    decrees above AND carried, in the same change, into the brief of every agent
    whose job could violate it — a review gate's instinct is to prescribe exactly
    the edits a decree forbids, and a brief that doesn't carry the decree will be
    right by its own lights and wrong.

### Documentation rule

**A doc line that mirrors state living elsewhere must name its source of truth or
not exist.** Mirrored lines go stale silently.

## Current status

<!-- AT MOST one short paragraph per milestone. Full as-built records live in
     docs/MILESTONES.md — link, do not restate. -->

**<M0>** — <one or two sentences on what landed>. Full record:
`docs/MILESTONES.md` § <M0>.

Open items: `docs/BACKLOG.md`.

**Next free number: <M1>.**
