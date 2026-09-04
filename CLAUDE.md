# shipyard

A Claude Code marketplace of project-level tooling. Its plugins give Claude the
context, guardrails, and configuration it needs to work well in a codebase —
starting with **keel**, which lays a project's AI development harness.

**The product here is a prompt, and a prompt's only proof is a run: every gate and
every claim in this repo must be demonstrated against the real artifact, never
asserted.**

That axis decides the arguments. A check that cannot fail, a doc line nobody
verified, an eval that never executed — each converts "unverified" into "verified"
in the record, which is the one defect this repo exists to not ship.

## Architecture

```
.claude-plugin/marketplace.json   the marketplace: name, owner, plugin list
plugins/<name>/                   one plugin, self-contained
  .claude-plugin/plugin.json      its manifest — name, description, version
  skills/<skill>/SKILL.md         a prompt; becomes /<plugin>:<skill>
  skills/<skill>/templates/       file shapes the skill writes into a target repo
scripts/                          gates: validate.mjs (structural), eval.mjs (behavioural)
evals/cases.mjs                   eval case definitions
```

**The hard boundary rule.** `marketplace.json` lives at the repo root and nowhere
else; `plugin.json` lives inside its own plugin and nowhere else. A plugin never
reaches outside its directory. If you are tempted to put shared content at the repo
root for two plugins to use, stop — duplicate it, or the plugins stop being
independently installable, which is the only reason they are separate.

**Lifecycle is the plugin boundary, not feature count.** keel covers a project's
early phase. Release engineering and mid-life refit get their own plugins when their
triggers fire (see `ROADMAP.md`), because a user who wants one should not be made to
install the others.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Plugin content | Markdown prompts + YAML frontmatter | what the harness actually loads |
| Gates | Node ESM, zero dependencies | identical command locally and in CI; nothing to install or audit |
| CI | GitHub Actions, SHA-pinned | the actions ARE this repo's dependency surface |
| Publishing | the GitHub repo itself | there is no separate registry; `git push` is the release |

No `package.json`, no lockfile, no runtime dependencies. Keep it that way — adding
one opens a supply-chain surface this repo currently does not have.

## Development commands

| Purpose | Command |
| --- | --- |
| Structural gates | `node scripts/validate.mjs` |
| ...with the version-bump rule | `node scripts/validate.mjs --since <base-ref>` |
| Manifest schema (CLI's own view) | `claude plugin validate .` |
| Behavioural gates (costs tokens) | `node scripts/eval.mjs` |
| One eval case | `node scripts/eval.mjs --case <substring> --no-ablation` |
| Local install for manual testing | `claude plugin marketplace add ./` then `claude plugin install keel` |

**Run gates unpiped and read the exit code.** `node scripts/validate.mjs | tail -2`
inside a `&&` chain reports the exit status of `tail`, so a red gate looks green and
the commit goes out anyway. This happened once, on commit `a5184f1`.

**Evals need `ANTHROPIC_API_KEY`.** Each case runs in an isolated
`CLAUDE_CONFIG_DIR` so the plugin under test comes from this working tree and the
ablation arm is genuinely plugin-free — and that isolation drops the CLI's stored
login. The runner refuses to fall back to the ambient config rather than grade a
contaminated environment. On Windows, a key persisted at User scope is not inherited
by an already-running session; read it without a restart with:

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable("ANTHROPIC_API_KEY","User")
```

## Conventions

- **English in the repo.** Conversation follows the user's language; everything
  committed — prompts, docs, commit messages — is English.
- **No comments in prompt files.** `SKILL.md` bodies are instructions to a model;
  HTML comments in templates are the exception and are meant to be deleted by the
  session that fills them.
- **Commit convention.** Conventional Commits (`type(scope): subject`). The body
  states what was verified and how, not just what changed.
- **Templates over inline prose.** A file shape a skill writes belongs in
  `templates/`, not restated in the SKILL.md body. One copy, one source of truth.

## Sensitive material

`ANTHROPIC_API_KEY` is the only sensitive value this repo touches.

- Never committed, never written into a file inside the repo, never passed as a
  command-line argument or interpolated into a shell string — process listings and
  shell history capture both. Read it from the environment at the point of use.
- `evals/results/` holds raw transcripts and is gitignored; treat its contents as
  untrusted output, not as a record to commit.
- A key pasted into a chat is a leaked key. Rotate it.

## Naming — four independent names

Confusing these is the usual way a plugin silently fails to load.

| Name | Set in | Controls |
| --- | --- | --- |
| `mirunamu00/shipyard` | the GitHub repo | the address for `marketplace add` |
| `shipyard` | `marketplace.json` → `name` | the marketplace, and the `@shipyard` suffix |
| `keel` | `plugins/keel/.claude-plugin/plugin.json` → `name` | the plugin, and the `/keel:` prefix |
| `setup` | the `skills/setup/` directory name | the skill, giving `/keel:setup` |

**Marketplace names are one global namespace per machine.** Adding a second
marketplace with the same `name` silently replaces the first — cached clone deleted,
no warning, no prompt. Verified by doing it. This is why the marketplace is
`shipyard` and not the more collidable `keel`.

**`marketplace add` rejects a bare `.`** — the source must be `./` or an absolute
path. The error names the accepted forms but not that `.` is excluded.

## The laws

1. **An instrument earns trust by failing first.** Every gate is proven RED against
   a planted violation before it counts as protection. A check with no valid
   population passes vacuously and is worse than absent, because it converts
   "unverified" into "verified". Both failures have already occurred here: the
   `action-pin` check matched `^\s*uses:` while real steps are written `- uses:`, so
   it would have passed on every workflow forever; a placeholder-leak check was
   written and then deleted because the only files that may carry placeholders here
   are the templates, where they are correct.
2. **Read the artifact, not a summary of it.** A failing grader is a claim about a
   transcript; keep the transcript and read it before deciding whether the prompt or
   the grader is wrong. `scripts/eval.mjs` writes one to `evals/results/` on failure
   for exactly this.
3. **A behavioural claim needs a behavioural test.** `validate.mjs` can prove a
   `SKILL.md` exists and parses. It cannot prove the skill still interviews before
   writing. That is what `eval.mjs` is for, and why prompt edits are not done without
   it.
4. **Ablate, or you are testing the base model.** An eval case that passes with the
   plugin absent measures Claude, not this repo. Cases marked `ablate` rerun without
   the plugin and are reported vacuous if they still pass.
5. **Version bumps are not optional.** Change a plugin's skills without changing its
   `version` and installed users never see the fix — `/plugin update` compares
   versions and finds nothing. CI enforces this; do not disable it.
6. **`git push` is the release.** There is no staging, no registry, no review queue.
   Both gates green before pushing, every time.
7. **A doc line that mirrors state living elsewhere names its source of truth or does
   not exist.** Milestone detail lives in `ROADMAP.md`; the READMEs link to it rather
   than restating it. This file stays a constitution, not a history book.
8. **Records are honest.** What was not run is recorded as "open, not waived", with
   its trigger. `ROADMAP.md` M1 carries the eval gap and the two guard defects found
   while proving the gates, because a clean-looking record of a messy build teaches
   the next session nothing.

## Environment notes

- **Windows + PowerShell 5.1.** No `&&`/`||` chaining, no ternary, no `head`/`tail`.
  Prefer the Bash tool for POSIX scripting; use PowerShell when reading persisted
  environment variables or launching processes with a modified environment.
- **`git push` needs the `gh` credential helper here.** The machine has two GitHub
  accounts and the default manager helper resolves to the wrong one (403). This
  repo's local config pins `credential.helper` to `!gh auth git-credential`; setting
  it without first clearing the inherited helper is not enough — the global one is
  consulted first.
- **`claude plugin eval` is gated** behind the server-side flag
  `tengu_gb_eval_authed_enable` and is unavailable on this account. `scripts/eval.mjs`
  exists because of that, not as a preference; see `ROADMAP.md` M1 for the migration
  trigger.

## Current status

**M1 — dogfood gates.** CI shipped: `scripts/validate.mjs` runs seven structural
checks on every push and PR, each RED-proven. Behavioural evals now run through
`scripts/eval.mjs` (four cases, ablation arms). Full record, including what is still
open: `ROADMAP.md` § M1.

Roadmap and milestone detail: `ROADMAP.md`.

**Next free number: M2.**
