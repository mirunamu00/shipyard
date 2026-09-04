# keel

> Lay the keel before you build — everything a project needs laid down at the start: the constitution, the agent roster, the review gates, and the verification wiring every later session works under.

The keel is the first timber laid in a ship, and every frame is fitted to it. Same
idea here: the harness goes down first, and everything a later session builds is
fitted to it.

**keel** is one plugin in the [shipyard](../../README.md) marketplace.

## Install

```
/plugin marketplace add mirunamu00/shipyard
/plugin install keel
```

## Skills

| Skill | What it does |
| --- | --- |
| `/keel:setup` | Builds a project's AI development harness from scratch |
| `/keel:audit` | Checks an existing harness against the laws it claims to follow — read-only, ranked findings |

Planned: `/keel:refresh`, `/keel:standards` — see [Roadmap](#roadmap).

---

## `/keel:setup`

Run it in the project you want to set up:

```
/keel:setup
```

You can seed the interview with a one-line description:

```
/keel:setup a Tauri desktop app for reviewing large diffs offline
```

It never runs on its own — model invocation is disabled, so it only fires when you
type it.

### What it does

It interviews you first, then writes. Nothing is generated until you confirm a
one-screen summary of every answer and every decision.

**Phase 0 — interview.** Ten questions, asked in small batches: what the product is
and who it's for, the one competitive axis every decision gets judged against, the
stack, the architecture boundary, the sensitive data, whether there's a visual
surface, what can actually be driven programmatically, what ships, who signs off,
and your process preferences.

**Phase 1 — decision forks.** Eight explicit rulings, each with a recommendation:
process weight, comment policy, delegation, the review-gate set, repo language,
milestone process, design process, and what you insist on judging personally. Any
trim is recorded with its named cost — never silently.

**Phase 2 — generation.** Adapted to your answers:

| Artifact | What it is |
| --- | --- |
| `CLAUDE.md` | The constitution: product + competitive axis, architecture boundary rule, stack table, repo layout, dev commands, coding conventions, security rules, efficiency principles, commit conventions, 19 numbered Laws, the pre-commit checklist as literal checkboxes, and a Current-status section ending in the live milestone-number pointer |
| `.claude/agents/` | One implementation agent per architectural layer, plus `security-reviewer`, `adversarial-reviewer`, `design-reviewer` (UI projects), and `field-qa`. Reviewers get read-only tool grants — enforced by the grant, not by prose |
| `.claude/skills/` | A live-verification harness procedure, a boundary-crossing recipe, and a gate-checklist skill |
| `docs/MILESTONES.md` | Spec → frozen contract → definition of done → as-built record → open items |
| `docs/BACKLOG.md` | Open items with why they're open and what triggers them; declined decisions with their reasons |
| `docs/DESIGN.md` | UI projects: tokens, type ladder, spacing, theming, and an append-only list of visual laws with the measurement behind each |
| Verification wiring | Code gates (format, lint, typecheck, tests, build), CI workflows including a SHA-pinned weekly dependency audit, a release-artifact gate that runs the *shipped* binary, commit-convention enforcement, and a `.gitignore` seeded for your sensitive files |
| Scaffold | On a greenfield repo: minimal toolchain config, an entry point, and one seed test — the substrate the gates run on |

**Phase 3 — close-out.** Runs the gates, proves two guards go RED before they're
believed, verifies the agents actually register with the harness, and prints a map
of every file it created.

The generated files are written from the templates in
[`skills/setup/templates/`](skills/setup/templates), so the output shape is
consistent across projects.

### After it runs — check these yourself

`/keel:setup` produces a lot in one session. Before you trust it:

1. **Read `CLAUDE.md` top to bottom, once.** It's loaded into every future session;
   a wrong line there compounds. Pay particular attention to the competitive axis
   sentence and the architecture boundary rule — everything else is judged against
   them.
2. **Confirm the agent roster registered.** Claude Code may only refresh agents at
   session start. Start a fresh session and check that every file in
   `.claude/agents/` shows up as an actual agent.
3. **Run each command in the dev-commands table yourself.** A gate listed but not
   verified is the exact failure the harness exists to prevent.
4. **Check `.gitignore` against your real secrets** before the first commit.
5. **Read `docs/BACKLOG.md`.** Anything the stack couldn't support on day one is
   parked there with a trigger condition. Those triggers are yours to honor.
6. **Confirm no `<placeholder>` survived** anywhere in the generated files.

## `/keel:audit`

Run it in a project whose harness already exists:

```
/keel:audit
```

It reads the constitution, the agent roster, the skills, the docs, and the CI
wiring, runs the tier-1 gates in check mode, and reports ranked findings — each
with `file:line` evidence, the law it violates, and a concrete prescription. It is
**read-only by tool grant**: it never edits, never fixes, and never mutates git
state — the same constraint keel imposes on the review agents it generates.

What it hunts, in the order the harness usually rots:

- **Silently absent protection** — a reviewer whose tool grant lets it write, a
  guard passing vacuously over zero files, a secret file tracked in git, a
  checklist item nothing can fulfil, a milestone-number collision waiting in the
  live pointer.
- **Drift** — the gate-checklist skill diverging from the constitution's checklist,
  a standing decree recorded in CLAUDE.md but missing from the agent briefs that
  could violate it, mirrored lines with no named source of truth.
- **Expired deferrals** — BACKLOG entries whose trigger condition already happened
  ("first scaffold commit", fifty commits ago) and quietly became permanent holes.
- **Dishonest records** — as-built numbers with no where-and-how of measurement,
  leftover `<placeholder>` stubs in files every session loads.

The report ends with an explicit "not checked — open, not waived" list, because an
audit that hides its own coverage gaps is the exact defect it exists to catch.

## Roadmap

More skills for the early phase of a project, in rough priority order:

- **`/keel:refresh`** — bring a harness written under an older keel up to the
  current template shape, without clobbering project-specific content.
- **`/keel:standards`** — extract coding standards from an existing codebase and
  write them into `CLAUDE.md` as enforceable, guard-backed rules rather than prose.

## Contributing

Adding a skill to keel: create `skills/<name>/SKILL.md`. It becomes `/keel:<name>`
with no marketplace change needed — but **bump `version` in
`.claude-plugin/plugin.json`**, or installed users will never see it. See the
[repo README](../../README.md#maintenance).

## License

[MIT](LICENSE) © Geonwoo Park
