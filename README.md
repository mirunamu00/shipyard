<p align="center">
  <img src="assets/shipyard.svg" width="128" alt="shipyard — hull frames rising from a laid keel">
</p>

<h1 align="center">shipyard</h1>

> A Claude Code marketplace of project-level tooling — plugins that give Claude the context, guardrails, and configuration it needs to work well in a codebase.

A shipyard is where vessels get built, and each one starts the same way: the keel
goes down first, and every frame is fitted to it. Same idea here. These are plugins
for the structure a project stands on, not for the features built on top of it.

## Install

```
/plugin marketplace add mirunamu00/shipyard
```

That registers the marketplace. Then install whichever plugins you want:

```
/plugin install keel
```

## Plugins

### [keel](plugins/keel) — the first timber

Everything a project needs laid down at the start: the constitution, the agent
roster, the review gates, the docs record system, and the verification wiring every
later session works under.

| Skill | What it does |
| --- | --- |
| `/keel:setup` | Interviews you about the product, stack, and verification reality, then writes `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, `docs/`, CI, and the code/release gates — tailored to the codebase |
| `/keel:audit` | Checks an existing harness against the laws it claims to follow — read-only by tool grant, ranked findings with `file:line` evidence |

Planned: `/keel:refresh`, `/keel:standards`. See
[plugins/keel/README.md](plugins/keel/README.md).

## Repository layout

```
.claude-plugin/
  marketplace.json          # the shipyard marketplace — lists every plugin below
assets/
  shipyard.svg              # the marketplace icon
plugins/
  keel/
    .claude-plugin/
      plugin.json           # this plugin's manifest — name, description, version
    skills/
      setup/
        SKILL.md            # the /keel:setup prompt
        templates/          # the file shapes /keel:setup writes
    README.md
```

`marketplace.json` lives only at the repo root, under `.claude-plugin/`. Each plugin
carries its own `.claude-plugin/plugin.json` and its own `skills/` directory. A
plugin's `source` in `marketplace.json` points at its directory (`./plugins/keel`).

## Adding a plugin

1. `mkdir -p plugins/<name>/.claude-plugin plugins/<name>/skills`
2. Write `plugins/<name>/.claude-plugin/plugin.json` with `name`, `description`,
   `version`, `author`.
3. Add an entry to `.claude-plugin/marketplace.json` with
   `"source": "./plugins/<name>"`.
4. `claude plugin validate .` — it must pass with no warnings.

Adding a **skill** to an existing plugin is simpler: create
`plugins/<plugin>/skills/<skill>/SKILL.md`. It becomes `/<plugin>:<skill>`. No
marketplace change needed.

## Naming

Four names, independent of each other. Confusing them is the usual way a plugin
fails to load.

| Name | Where it is set | What it controls |
| --- | --- | --- |
| `mirunamu00/shipyard` | the GitHub repo | the address users pass to `marketplace add` |
| `shipyard` | `marketplace.json` → `name` | the marketplace, and the `@shipyard` suffix |
| `keel` | `plugins/keel/.claude-plugin/plugin.json` → `name` | the plugin, and the `/keel:` skill prefix |
| `setup` | the `skills/setup/` directory name | the skill, giving `/keel:setup` |

Marketplace names are a single global namespace on each user's machine. Adding a
second marketplace with the same `name` **silently replaces the first**, cached
clone and all — no warning, no prompt. Keep `shipyard` distinctive.

## Maintenance

**Bump `version` in the changed plugin's `plugin.json` on every change to its skills
or templates.** Claude Code decides whether `/plugin update` has anything to fetch by
comparing that version. Ship a prompt fix without bumping it and installed users stay
on the old version without knowing.

Local testing, from the repo root:

```
/plugin marketplace add ./
/plugin install keel
```

A bare `.` is rejected by the source-format check — it must be `./`. Then `cd` to a
**different, empty directory** before running any skill; running `/keel:setup` inside
this repo will set up this repo.

## License

[MIT](LICENSE) © Geonwoo Park
