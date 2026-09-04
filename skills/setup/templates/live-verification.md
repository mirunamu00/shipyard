<!--
  keel:setup template — written to
  .claude/skills/<live-verification-skill-name>/SKILL.md.

  HOW TO USE THIS FILE
  - Name the skill after the real instrument, not generically
    (e.g. "drive-app", "cdp-harness", "cli-harness", "api-probe").
  - Fill every <placeholder> with real commands and real selectors; delete every
    HTML comment.
  - If the stack has no drivable artifact yet, still write this file as a WRITTEN
    PROCEDURE, and add a docs/BACKLOG.md entry whose trigger is "before the first
    UI/feature milestone". Do not leave it out — a missing tier-2 procedure is how
    tier-3 human checklists grow.
  - The "Instrument validation" section is not optional. Law 8 lives here.
-->
---
name: <live-verification-skill-name>
description: Drive the real running <app/service/device> to prove a change works — launch, attach, assert, capture. Use whenever a change needs live proof, which is every commit.
---

# Live verification (tier 2)

Green code gates are necessary but not sufficient (Law 1). This skill is how a
session produces the live proof the pre-commit checklist requires.

**Serial only.** Two agents driving one running artifact corrupt each other's
sessions and produce phantom findings (Law 3). Before launching, confirm no other
gate is currently driving.

## 1. Launch

```
<exact command(s) to build and start the artifact in a drivable mode>
```

<Ports, flags, profile/user-data directory, environment variables. Any state that
must be reset between runs, and the command that resets it.>

## 2. Attach

```
<exact command or code to attach the driver — CDP endpoint, CLI harness entry,
API client, device session>
```

<How to tell attachment succeeded, and what failure looks like.>

## 3. Instrument validation — run this BEFORE trusting any reading

<!-- Law 8. Do not trim this section. -->

An instrument that can pass — or fail — vacuously is worse than none, because it
converts "unverified" into "verified" in the record.

- [ ] **The capture is complete.** <Assert the screenshot/dump covers the FULL
      viewport or payload — compare captured dimensions against the reported
      viewport, not against expectation. Silently cropped captures invalidate
      every visual judgement made from them.>
- [ ] **Every probe is provably live.** <Before believing a "zero events" or
      "no errors" reading, assert the probe is installed and firing — trigger one
      known event and see it.>
- [ ] **A new guard was proven RED.** <Plant the defect (or a staged mutation),
      CONFIRM the mutation is actually present in the artifact the guard reads,
      run the guard, see RED, then revert and see green. A mutation that silently
      failed to apply proves nothing.>
- [ ] **Fixture data is realistic.** <Empty and lorem-ipsum states hide density
      and overflow defects.>

## 4. Assert

<The standard assertions for this project: what to read, from where, and what
counts as pass. Read the artifact itself — DOM, raster, wire, binary, built
output — never a summary of it (Law 9).>

```
<example assertion snippet>
```

## 5. Capture

```
<exact command to capture screenshots / logs / traces, and where they land>
```

<For UI: all themes, realistic data, multiple widths. A width, color, or figure
is only valid at the size, face, and theme that produced it (Law 9).>

## 6. Tear down

```
<exact command; what must be cleaned up so the next run is not contaminated>
```

## When a spec fails

First ask whether the spec's model of the app is stale. Then ask whether the app
is broken (Law 8). Fixing a stale spec to match a real regression is the failure
mode this ordering prevents.

## Recording

Every number this skill produces states where and how it was measured (Law 9).
Paste the measurement, not the conclusion, into the as-built record in
`docs/MILESTONES.md`.
