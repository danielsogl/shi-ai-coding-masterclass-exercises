# E5 — Red-green-refactor with hooks

**Module:** M3 · **Time box:** 30 min · **Proves:** red-green + golden rule

## Goal

Turn E4's acceptance criteria into failing tests, watch an agent loop them
to green, then wire up deterministic hooks so that verification isn't
optional.

## Starting state

`exercises/my-waitlist-spec.md` from Exercise E4 (or use the shared spec
in `exercises/C2-waitlist.md` if you skipped E4).

## Steps

1. Turn 2-3 of your Given-When-Then criteria into failing tests in
   `apps/api/src/waitlist.test.ts` (the module doesn't exist yet — that's
   fine, that's the RED step). Run `npm run test:affected` and confirm you
   see real failures, not just "file not found" noise.
2. Let your agent implement just enough of `apps/api/src/waitlist.ts` to
   make those tests pass. Stay in the loop — read every change before
   accepting it.
3. Once green, ask for one small refactor (extract a helper, rename for
   clarity) and confirm the tests still pass afterward.
4. Install the hooks: copy `exercises/reference/claude-code/settings.json`
   and `hooks/` into `.claude/` (see that folder's README for the exact
   commands and the current Copilot equivalent/gap). Confirm both hooks
   work standalone before trusting them:
   ```sh
   echo '{"tool_name":"Edit","tool_input":{"file_path":"apps/api/src/waitlist.test.ts"}}' \
     | .claude/hooks/deny-test-edits.sh; echo "exit: $?"   # expect 2
   ```
5. Ask your agent to "fix" `waitlist.test.ts` directly (pick any excuse:
   "this test seems wrong"). Confirm the `PreToolUse` hook blocks it. This
   is the golden rule (M3e) made mechanical, not just a norm.

## Done when

- You have a real RED run (failing test output) and a real GREEN run
  (passing) for the waitlist feature, both in your notes or terminal
  history.
- The `Stop` and `PreToolUse` hooks are installed and you've demonstrated
  each one blocking something (a broken change, an edit to a test file).

## Stretch

Make the `Stop` hook fail once on purpose (break something small) and
watch the agent read the blocking reason and fix it without you
re-explaining the problem.

## In your own repo instead

Pick one acceptance criterion from a spec you own, write the failing test
first, then install the same two hooks.
