---
name: code-review
description: Review the current diff against the acceptance criteria in docs/specs/<feature>.md. Use after implementing a feature and before opening a pull request. Runs in a fresh sub-agent, read-only, and reports findings by severity with file:line.
---

# Code review against the spec

Run this in a fresh sub-agent, not in the session that wrote the code. Give it
only the spec path, the base branch (default `main`) and the rules file
(`AGENTS.md`). It must not see the conversation that produced the change.

Optional second opinion from another model, read-only:
`codex exec "<this review>"` or `copilot -p "<this review>" -s --deny-tool write`.
Use it only if that model is at least as strong as the one that wrote the code.

## Rules

- Read-only. Never edit, write, commit or install. Running the tests is allowed.
- Review only the lines in `git diff main...HEAD`. Ignore problems that were already there.
- Report only gaps against the spec, security or the project rules.
  No style preferences, nothing the linter already catches.
- Leave out findings you are not sure about.

## Steps

1. Read `docs/specs/<feature>.md` and list every acceptance criterion.
2. Read the diff and `AGENTS.md`.
3. For each criterion: met, partly or missing, with file:line as evidence.
4. Tests: does each criterion have a test? Run `npm test` and report the result.
5. Scope: list changes the spec does not ask for.
6. Security: input handling, secrets, anything sent to the network.
7. Rules: anything that breaks `AGENTS.md`.

## Output

```
Verdict: PASS | CHANGES REQUESTED

Criteria
- AC1 <short name>: met | partly | missing (file:line)

Findings (CRITICAL > HIGH > MEDIUM > LOW)
- [HIGH] src/app/x.ts:42 - what is wrong - why it matters - suggested fix
```

Hand the findings back to the author session. It fixes them; then run a new
review in a new sub-agent.
