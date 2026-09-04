<!--
  keel:setup template — written to docs/DESIGN.md. UI projects only.

  HOW TO USE THIS FILE
  - Fill every <placeholder> with real values from the project's renderer, not
    plausible defaults. A token nobody measured is a Law-9 defect waiting to be
    quoted.
  - The "Visual laws" section grows over the life of the project: every
    design-gate lesson worth keeping is appended there as a rule WITH the
    measurement that created it (Law 17), so the same defect cannot ship twice.
  - Delete every HTML comment before writing the file.
-->

# Design system

Target persona: <who, from Phase 0 Q1>. Density bar: <the best tools in this
product's category, named — the design gate audits against them, not against
generic "clean UI">.

Themes: <dark / light / both>. Every token below is stated per theme; a color is
only valid in the theme that produced it.

## Tokens

### Color

| Token | <Theme A> | <Theme B> | Used for |
| --- | --- | --- | --- |
| `<--bg>` | `<#...>` | `<#...>` | <...> |
| `<--fg>` | `<#...>` | `<#...>` | <...> |
| `<--accent>` | `<#...>` | `<#...>` | <...> |
| `<--danger>` | `<#...>` | `<#...>` | <...> |

<Contrast ratios, with the pair they were measured against.>

### Type ladder

| Step | Size | Line height | Weight | Face | Used for |
| --- | --- | --- | --- | --- | --- |
| `<display>` | `<...>` | `<...>` | `<...>` | `<...>` | <...> |
| `<body>` | `<...>` | `<...>` | `<...>` | `<...>` | <...> |
| `<caption>` | `<...>` | `<...>` | `<...>` | `<...>` | <...> |

<A width or figure is only valid at the size, face, and theme that produced it.>

### Spacing

Base unit: `<n>`. Scale: `<the permitted steps>`. Values off the scale are a
finding.

### Motion

<Durations, easings, and where motion is permitted. Motion is only spent where it
can be seen (Law 17).>

## Theming rules

- <How a component resolves a token; what is never hard-coded.>
- <What must be re-checked in the other theme before any visual sign-off.>

## Mock-first process

<The F6 ruling. If mock-first: new visual anatomy gets an HTML mock that the
session RENDERS and READS — both themes, realistic data, multiple widths —
before it is shown to the maintainer. If the tier-2 harness is deferred to
BACKLOG, mock-first activates the moment the harness lands; say so here.>

## Visual laws

<!-- APPEND ONLY, and never without a measurement. Format:

### L<n> — <the rule, stated as an imperative>
Measured: <what was observed, where, at what size/face/theme, on what date>.
Why: <the defect this prevents>.

Seed laws below are load-bearing across projects. Keep them; add to them. -->

### L1 — A comparison surface leads with the comparison

Measured: <fill on first design-gate finding>.
Why: a surface whose job is comparison that buries the delta below the fold has
failed at its only job.

### L2 — A recovery promise is a claim the code must keep

Measured: <fill on first design-gate finding>.
Why: "your work is saved" beside code that does not save is the dominant defect
species — a claim its own artifact falsifies (Law 9).

### L3 — Judge density against real data, never fixtures

Measured: <fill on first design-gate finding>.
Why: empty and lorem-ipsum states hide overflow, truncation, and density
defects, and every screenshot judged from them is invalid.

## Design gate

The `design-reviewer` agent reviews REAL rendered screenshots — all themes,
realistic data, multiple widths — rejects generic template/AI-looking design on
sight, and prescribes concrete direction (exact hierarchy, sizes, spacing, what
data to add). Its prescriptions are proposals: the implementer may decline one
**on measurement**, recording the number that refutes it (Law 11).
