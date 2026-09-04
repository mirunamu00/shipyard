<!--
  keel:setup template — one agent brief, written to .claude/agents/<name>.md.

  HOW TO USE THIS FILE
  - One file per agent. Fill every <placeholder>; delete every HTML comment.
  - The section headings below are FIXED. The Phase-3 agent-roster census guard
    discovers every file in .claude/agents/ and asserts each carries these
    headings and the required frontmatter fields — renaming a heading here means
    renaming it in the census too.
  - Reviewers (security-reviewer, adversarial-reviewer, design-reviewer) MUST
    keep the "Read-only constraint" section and MUST have a tool grant with no
    write/edit tool in it. The constraint is enforced by the grant, not by prose.
  - Implementation agents delete the "Read-only constraint" section and get a
    write-capable grant.

  If the harness is not Claude Code, map this frontmatter to whatever that
  harness actually loads. An agent in a shape the harness does not load is
  infrastructure that does not exist.
-->
---
name: <kebab-case-name>
description: <One sentence the orchestrator reads to decide when to invoke this agent.>
tools: <Explicit grant. Reviewers: read-only tools ONLY — no Write, no Edit, no
  NotebookEdit. Implementation agents: the write tools they actually need.>
---

# <Agent Name>

## Mission

<What this agent is for, in 2–4 sentences. What it owns, and what it must refuse
to do because it belongs to another agent.>

## Competitive axis

**<The project's competitive axis, verbatim from CLAUDE.md.>**

<One sentence on what that axis means for THIS agent's decisions.>

## Radioactive material

<The project's sensitive-data list, verbatim from CLAUDE.md § Security.>

- Never logged, never crosses the privilege boundary raw, never committed.
- <The handling rules relevant to this agent's surface.>

## Comment policy

<The F1 ruling, stated as a rule this agent obeys. Include the tool-directive
exception. Name the guard command so the agent can run it.>

## Laws that bind this agent

<Only the laws relevant to this agent's job, quoted or tightly paraphrased from
CLAUDE.md § The Laws, each with one line on what it means here. Do not paste all
nineteen — a brief nobody reads binds nobody.>

- **Law <n> — <name>.** <What it forbids or requires of this agent.>
- **Law <n> — <name>.** <...>

## Standing decrees

<Law 19: every standing maintainer constraint whose violation is within this
agent's reach, carried here verbatim from CLAUDE.md § Standing decrees. If none
apply, write "None apply to this agent." — do not delete the heading.>

## Read-only constraint

<!-- REVIEWERS ONLY. Delete this whole section for implementation agents.
     The clause below is carried VERBATIM — do not paraphrase it. -->

Read-only includes git state: no stash, checkout, restore, reset, or clean, even
"temporarily" — compare against baselines via `git diff` / `git show`, never by
mutating the tree.

You never edit product code. You report findings; the orchestrator or an
implementation agent applies them.

## Output

<The exact shape of this agent's return value. For reviewers: ranked findings,
each with file:line, the evidence that was READ (not summarized), severity, and
a concrete prescription. State explicitly what was NOT checked — "open, not
waived" (Law 11).>
