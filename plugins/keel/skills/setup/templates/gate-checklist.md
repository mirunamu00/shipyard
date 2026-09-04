<!--
  keel:setup template — written to .claude/skills/gate-checklist/SKILL.md.

  HOW TO USE THIS FILE
  - Fill every <placeholder> with this project's real commands; delete every
    HTML comment.
  - The checklist body is a MIRROR. Its source of truth is
    CLAUDE.md § Agents & gates → Pre-commit checklist. Keep the source-of-truth
    line below (the constitution's own documentation rule requires it) and edit
    the constitution first when the checklist changes.
-->
---
name: gate-checklist
description: Run the pre-commit gates for this project and confirm every box before committing. Use before every commit.
---

# Pre-commit gates

Source of truth for the checklist below: `CLAUDE.md` § Agents & gates →
Pre-commit checklist. If the two ever disagree, that file wins and this one is
wrong.

## Order of operations

1. **Scope the review range.** Gates review the product, never the maintainer's
   tooling — `.claude/**` and AI config are out of scope (Law 2). State the range
   explicitly when invoking each reviewer.
2. **Run the code gates first.** They are the cheapest tier and they fail fast.
3. **Run the review gates.** `security-reviewer` and `adversarial-reviewer` in
   parallel (Law 1) — but **artifact-driving gates run serially** (Law 3): only
   one agent may drive the running <app/service/device> at a time. Source-only
   reviewers may run alongside the one driver.
4. **UI-visible change** → `design-reviewer`, on real rendered screenshots, all
   themes, realistic data, multiple widths — before the maintainer's visual
   sign-off.
5. **Address every finding in this pass** (Law 4), then **re-run the gates on the
   fix delta** (Law 5).
6. **Only then commit.**

## Code gates

| Gate | Command | Bar |
| --- | --- | --- |
| Format | `<...>` | No diff |
| Lint | `<...>` | Zero warnings (warnings are errors) |
| Typecheck | `<...>` | Clean |
| Unit tests | `<...>` | Green |
| Comment-policy guard | `<...>` | Green |
| Build | `<...>` | Succeeds |
| Release artifact | `<...>` | Builds AND boots |

<On an existing codebase wired with a ratcheting baseline: state the pinned
number here and that it may only shrink.>

## The checklist

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

## What "live proof exists" means

Green code gates are necessary but not sufficient (Law 1). A live run of the
real artifact must demonstrate the change working — use the
`<live-verification-skill-name>` skill. Read the artifact itself (DOM, raster,
wire, binary, built output), never a summary of it (Law 9).

## Recording the result

The as-built record in `docs/MILESTONES.md` states what was NOT run — "open, not
waived" (Law 11). A box you skipped is recorded as skipped, with why.
