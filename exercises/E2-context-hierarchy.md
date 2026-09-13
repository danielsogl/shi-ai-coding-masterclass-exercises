# E2 — Context hierarchy

**Module:** M2 · **Time box:** 20 min · **Proves:** context hierarchy

## Goal

Standardize context with `AGENTS.md` and see a monorepo-level override in
action, instead of repeating yourself in every prompt.

## Starting state

This repo ships with **no** `AGENTS.md`, `CLAUDE.md`, or
`copilot-instructions.md` at all — you're writing the first one.

## Steps

1. Write a root `AGENTS.md`: workspace layout, `npm run check` as the
   definition of done, and the one rule that would have saved you time in
   E1 (e.g. "never edit `*.test.ts` files").
2. Write `packages/pricing/AGENTS.md`: something true only in that
   package (e.g. "prices are always integer cents, never floats — see
   `pricing.ts`").
3. If you're using Claude Code, bridge it: add a root `CLAUDE.md`
   containing `@AGENTS.md` (Claude Code does not read `AGENTS.md` natively
   — see `exercises/reference/claude-code/README.md` and
   `code.claude.com/docs/en/memory`). Copilot reads `AGENTS.md` directly,
   no bridge needed.
4. Re-run a task from E1 (or one that went wrong for you before) and check
   whether the agent now respects the rule you wrote down.

## Done when

- Root `AGENTS.md` and `packages/pricing/AGENTS.md` exist and are true.
- (Claude Code users) `CLAUDE.md` exists and imports `AGENTS.md`.
- You can point to one behavior change caused by the new context.

## Stretch

Add a third `AGENTS.md` inside `packages/legacy-invoice` that states the
one rule from Exercise E3 ("don't touch this without a characterization
test first") and confirm the agent picks it up when you ask it to change
something there.

## In your own repo instead

Write a 10-line root `AGENTS.md` for a repo you actually work in. Bridge it
for whichever tool you use if it doesn't read `AGENTS.md` natively.
