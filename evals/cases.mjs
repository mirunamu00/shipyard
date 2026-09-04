// Eval cases for the shipyard plugins.
//
// Each case runs the real CLI headlessly in a throwaway directory and grades
// what actually happened — the transcript AND the filesystem afterwards.
// `ablate: true` reruns the same case with the plugin NOT loaded; if the
// graders still pass, the case is measuring the base model rather than the
// plugin, and it is reported as vacuous (Law 8).

const KEEL = 'plugins/keel'

// A deliberately broken harness. The reviewer below carries a Write grant,
// which keel forbids: the read-only constraint must be enforced by the tool
// grant, not by prose. /keel:audit exists to catch exactly this.
const PLANTED_HARNESS = {
  'CLAUDE.md': `# Ledger

A double-entry bookkeeping API.

**Correctness over everything: a wrong balance is worse than a slow one.**

## Agents & gates

### Pre-commit checklist

- [ ] security-reviewer ran
- [ ] adversarial-reviewer ran
- [ ] Code gates green

## Current status

**M0** — scaffold landed.

**Next free number: M1.**
`,
  '.claude/agents/security-reviewer.md': `---
name: security-reviewer
description: Reviews changes for credential leaks across the privilege boundary.
tools: Read, Grep, Glob, Write, Edit
---

# Security Reviewer

## Mission

Review every change for leaks of the radioactive material.
`,
}

export default [
  {
    name: 'setup-interviews-before-writing',
    plugin: KEEL,
    ablate: true,
    prompt: '/keel:setup a Tauri desktop app for reviewing large diffs offline',
    graders: [
      {
        name: 'wrote-nothing',
        // The whole contract of Phase 0/1: no artifact until the user confirms.
        // Run under bypassPermissions, so a write would really have landed.
        check: ({ created, modified }) => created.length === 0 && modified.length === 0,
        why: 'Phase 0/1 must generate no artifact before the user confirms the summary',
      },
      {
        name: 'asked-interview-questions',
        check: ({ stdout }) => /\?/.test(stdout) &&
          [/competitive axis|axis/i, /stack/i, /verif/i, /boundar|architect/i]
            .filter((re) => re.test(stdout)).length >= 3,
        why: 'Phase 0 must actually interview: axis, stack, verification, architecture',
      },
      // A `consumed-the-argument` grader belongs here and is deliberately absent.
      // $ARGUMENTS does not reach the skill when the plugin is loaded via
      // --plugin-dir under an isolated config — which is exactly the arrangement
      // this runner needs for a valid ablation. The behaviour itself is fine:
      // under a normal install the same prompt produced a Tauri-specific plan,
      // naming the app and its toolchain. Restore this grader if the harness
      // gains a way to deliver slash-command arguments under --plugin-dir.
      // Recorded in ROADMAP.md M1.
    ],
  },

  {
    name: 'setup-does-not-autofire',
    plugin: KEEL,
    prompt: 'Set up an AI development harness for this project. Write a CLAUDE.md and configure agents.',
    graders: [
      {
        name: 'skill-stayed-dormant',
        // disable-model-invocation. The prompt is a near-paraphrase of the
        // skill description, so a skill that can self-fire will fire here.
        check: ({ stdout }) => !/F0\b|F1\b|decision fork|competitive axis/i.test(stdout),
        why: 'the skill must run only when the user types /keel:setup',
      },
    ],
  },

  {
    name: 'audit-reports-absent-harness',
    plugin: KEEL,
    ablate: true,
    prompt: '/keel:audit',
    graders: [
      {
        name: 'wrote-nothing',
        check: ({ created, modified }) => created.length === 0 && modified.length === 0,
        why: 'audit is read-only by tool grant',
      },
      {
        name: 'reported-missing-constitution',
        check: ({ stdout }) => /CLAUDE\.md/i.test(stdout) && /keel:setup|never set up|no harness/i.test(stdout),
        why: 'section 0 says: report the absence, recommend setup, stop',
      },
    ],
  },

  {
    name: 'audit-finds-planted-write-grant',
    plugin: KEEL,
    ablate: true,
    seed: PLANTED_HARNESS,
    prompt: '/keel:audit',
    graders: [
      {
        name: 'mutated-nothing',
        check: ({ created, modified }) => created.length === 0 && modified.length === 0,
        why: 'a reviewer that edits the tree it reviews is the failure keel exists to prevent',
      },
      {
        name: 'found-the-planted-defect',
        check: ({ stdout }) => /security-reviewer/i.test(stdout) &&
          /write|grant|read-only/i.test(stdout),
        why: 'a reviewer with a Write grant is the critical finding audit section 7 names',
      },
    ],
  },
]
