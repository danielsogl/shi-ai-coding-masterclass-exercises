# GitHub Copilot reference material

Copilot equivalents of the Claude Code reference material next door, and
where an equivalent does not (fully) exist yet. Checked 2026-09.

## `copilot-instructions.md` → context

Equivalent of a project `CLAUDE.md`. Copy to `.github/copilot-instructions.md`
at the repo root. For path-scoped rules, add
`.github/instructions/<name>.instructions.md` files with an `applyTo: <glob>`
frontmatter field — Copilot's closer analog to Claude Code's
`.claude/rules/*.md` `paths:` scoping.
(`docs.github.com/en/copilot/how-tos/configure-custom-instructions`)

## `agents/legacy-researcher.agent.md` → sub-agent

Equivalent of the Claude Code sub-agent. Copy to
`.github/agents/legacy-researcher.agent.md`. Frontmatter fields: `name`,
`description` (required), `tools`, `model`, `target`. Invoke with
`@legacy-researcher`. (Microsoft Learn / `docs.github.com/en/copilot/reference/custom-agents-configuration`)

## `skills/legacy-summary/SKILL.md` → skill

Same Agent Skills open standard (agentskills.io) format as the Claude Code
version. As of 2026-09, GitHub has GA'd Agent Skills support specifically
for **Copilot code review** (`.github/skills/<name>/SKILL.md`, GA
2026-07-29) — not confirmed as available to Copilot's interactive chat/agent
modes the same way. Copy it in for code-review use; verify current docs
before assuming it also fires in chat.

## Hooks — partial equivalent, verify before relying on it

GitHub announced **Copilot agent hooks in public preview** (changelog
2026-03-11, alongside JetBrains IDE agentic improvements): a
`.github/hooks/hooks.json` file with events `userPromptSubmitted`,
`preToolUse`, `postToolUse`, and `errorOccurred`. That is a real equivalent
to Claude Code's `PreToolUse`/`Stop` hooks in spirit.

We did **not** include working `hooks.json` examples here, on purpose: at
the time of writing, GitHub's public changelog names the file location and
event list but does not publish the JSON schema for how a hook blocks or
denies an action (the piece our `deny-test-edits.sh` and `stop-verify.sh`
depend on), and the feature was announced as JetBrains-IDE-scoped preview,
not a cross-editor CLI feature the way Claude Code hooks are. Rather than
invent a schema and risk shipping something that silently doesn't work,
this is the one item in this reference set we're flagging as **"exists,
but verify the current docs before you build on it."**
