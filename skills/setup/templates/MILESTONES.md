<!--
  keel:setup template — written to docs/MILESTONES.md.

  HOW TO USE THIS FILE
  - This file, not CLAUDE.md, is where detail lives. CLAUDE.md § Current status
    holds at most one short paragraph per milestone and points here.
  - Milestone numbers come from ONE live pointer: the `Next free number` line at
    the end of CLAUDE.md § Current status (Law 13). Read it and update it at
    claim time, after syncing with the remote once one exists. Never number a
    milestone from what you see in this file.
  - Copy the block under "Milestone template" for each new milestone. Keep the
    section order — the frozen contract is written BEFORE implementation starts
    and is not edited afterwards without saying so.
  - Delete every HTML comment before writing the file.
-->

# Milestones

Numbering scheme: <the F5 scheme, e.g. `M<n>` / `v0.<n>` / `<epic>.<n>`>.
The live pointer for the next free number is `CLAUDE.md` § Current status, last
line (Law 13).

Process: <the F5 ruling — spec-first with frozen contracts, or the looser process
the user chose>.

---

## Milestone template

<!-- Copy from here down for each new milestone. Delete this template block from
     the written file only if the user objects to carrying it; it is cheaper to
     keep than to re-derive. -->

### <M-n> — <Title>

**Status:** <planned | in progress | shipped>
**Claimed:** <date> · **Shipped:** <date or ->

#### Spec

<What this milestone delivers, and why now. One or two paragraphs. State the
user-visible outcome, not the implementation.>

#### Frozen contract

<!-- Written BEFORE parallel agents build (Law 12). Wire/API shapes, event names,
     column keys, file formats, error codes — anything two agents must agree on.
     Once frozen, a change here is itself a recorded event with a reason. -->

```
<the exact shapes>
```

Frozen on <date>. Changes after this point: <none | list each with its reason>.

#### Definition of done

- [ ] <Concrete, checkable outcome.>
- [ ] <...>
- [ ] Pre-commit checklist green (`CLAUDE.md` § Agents & gates)
- [ ] Live proof captured and referenced below

#### As-built record

<!-- Records are honest (Law 11). Write what was actually built, including where
     it diverged from the spec and why. -->

<What landed, by file/module. Where the implementation diverged from the spec,
and the reason.>

**Measurements.** <Every recorded number states where and how it was measured
(Law 9). No number without its method.>

**Live proof.** <What was driven, with which skill, and what was observed. Paste
the measurement, not the conclusion.>

**Negative results.** <Approaches tried and rejected, with reasons, so no future
session repeats the experiment (Law 11).>

**Declined prescriptions.** <A review prescription may be declined only on
measurement — record the number that refutes it (Law 11).>

#### Open items

<!-- "Open, not waived." A gate that did not run is listed here, not omitted. -->

- <Item> — open, not waived. Blocked on: <what>. Trigger: <condition>.
  Tracked in `docs/BACKLOG.md`.
