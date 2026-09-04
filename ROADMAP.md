# Roadmap

Shipyard's milestones. This file is the source of truth for what gets built next;
the READMEs point here instead of restating it. Numbers are claimed from the live
pointer at the bottom, per keel's own Law 13.

Ordering principle: keel skills that pay off every cycle come before trigger-gated
work; a new plugin is opened only when its concern is genuinely different from
keel's (early phase) — lifecycle stage is the boundary, not feature count.

---

## M1 — Dogfood gates: CI and evals for shipyard itself

**Status:** planned

**Goal.** A GitHub Actions workflow (SHA-pinned) running `claude plugin validate .`
on every push and PR, plus `evals/` cases for the existing skills run via
`claude plugin eval`: setup must interview before writing anything, audit must stay
read-only and produce ranked findings.

**Why first.** This repo preaches day-one verification wiring and currently has
none — the exact finding `/keel:audit` would open with elsewhere. The marketplace
that ships the laws goes first.

**Done when.** CI is green on main; at least one eval case per shipped skill; a
red eval was observed once (non-vacuity, Law 8) before being trusted.

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
