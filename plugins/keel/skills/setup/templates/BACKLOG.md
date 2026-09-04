<!--
  keel:setup template — written to docs/BACKLOG.md.

  HOW TO USE THIS FILE
  - Every entry carries WHY it is open (blocked on what) and its TRIGGER
    condition. An entry without a trigger is a wish, not a backlog item.
  - This is NOT a deferred-defect list. Law 4: a discovered defect is fixed in
    the same pass. Deferral is allowed only when genuinely blocked on something
    external, and the entry must say what.
  - Declined decisions are recorded with their reasons AND the condition under
    which they would be revisited — so no future session re-litigates them.
  - Delete every HTML comment before writing the file.
-->

# Backlog

## Open items

<!-- Format, one per item. -->

### <Item title>

- **Why it is open:** <blocked on what — a missing artifact, an external
  dependency, a decision the maintainer has not made>
- **Trigger:** <the condition that makes this actionable, e.g. "first scaffold
  commit", "before the first UI/feature milestone", "as soon as the first API
  endpoint exists">
- **What to do when triggered:** <concrete next step, not a restatement of the
  title>
- **Cost of not doing it:** <what breaks or goes unverified in the meantime>

<!-- After-first-feature items that keel:setup routinely creates, when the stack
     could not support them on day one. Delete the ones that were actually built.

### Live-verification harness wiring
- **Why it is open:** no drivable artifact exists yet.
- **Trigger:** before the first UI/feature milestone.
- **What to do when triggered:** implement the procedure in
  `.claude/skills/<live-verification-skill-name>/SKILL.md`, then run its
  instrument-validation checklist before trusting any reading.
- **Cost of not doing it:** every commit's "live proof" box is unfulfillable, and
  checks that belong at tier 2 migrate to tier-3 human lists (Law 6).

### Boundary-crossing recipe skill
- **Why it is open:** the project's most repeated wiring has no first instance yet.
- **Trigger:** as soon as the first <API endpoint / IPC command / job type> exists.
- **What to do when triggered:** write the step-by-step recipe for adding one more.
- **Cost of not doing it:** every session re-derives the wiring and they diverge.

### Release-artifact gate
- **Why it is open:** no shipped artifact exists yet.
- **Trigger:** the first release build.
- **What to do when triggered:** a script that builds and EXECUTES the shipped
  artifact (not the dev flavor) and asserts it boots.
- **Cost of not doing it:** a release-only boot crash ships under a fully green
  suite, because dev and release are different binaries and nothing runs the
  release one (Law 7).
-->

## Declined decisions

<!-- Recorded so no session re-litigates them. -->

### <Decision>

- **Declined:** <date>
- **Reason:** <why — with the measurement if there was one (Law 11)>
- **Revisit if:** <the condition under which this would be reopened>

## Future / v2 parking lot

<!-- Ideas that are real but out of scope for the current direction. No triggers
     required here; this is the deliberate "not now" pile. -->

- <Idea> — <one line on what it would be>
