# Tickets — AI Coding Master Class exercises

Starter repository for the hands-on exercises in the [AI Coding Master
Class](https://github.com/danielsogl/shi-ai-coding-masterclass). "Tickets"
is a small, deliberately imperfect conference-ticketing monorepo: real
code, real tests, and a few intentional rough edges you'll use as material
throughout the workshop. Everything here works with Claude Code or GitHub
Copilot — it's harness-agnostic.

## What's in here

```
packages/pricing/         ticket price, discount codes, group rates, VAT — well tested
packages/legacy-invoice/  older, untyped, undocumented — no tests on purpose
apps/api/                 a small HTTP API over both packages
exercises/                the hands-on exercises themselves — start here
```

See [`exercises/README.md`](./exercises/README.md) for the exercises.

## Setup

Requires Node.js 24+.

```sh
npm ci
npm run check   # typecheck + lint + test
```

No build step: this repo runs TypeScript directly (Node 24's native TS
support), so `npm run check` and `apps/api`'s `npm start` both work with
zero compilation.

## Expected test output on `main`

This repo is **not** meant to be all-green out of the box. Two things are
intentional, not bugs you introduced by cloning:

- **One test always fails**: `apps/api/src/server.test.ts` →
  `Tickets API > reports health status as ok`. This is a pre-existing,
  deterministic, broken baseline — unrelated to any exercise. Exercise E6
  has you record it rather than fix it, which is itself the point of that
  exercise.
- **One test fails roughly 1 run in 4**: `apps/api/src/server.test.ts` →
  `Tickets API > FLAKY: availability is ready shortly after the server
  starts`. It races a simulated async cache warm-up. Run `npm test` a
  handful of times if you don't see it fail on the first try. Exercise E6
  has you quarantine it properly instead of chasing the flake.

Everything else — `npm run typecheck`, `npm run lint`, and every other
test — is green on a clean clone. If you see a different failure, that's a
real regression, not one of these two.

`packages/pricing/src/discounts.test.ts` deserves a second look too: it
passes and shows 100% line coverage of `discounts.ts`, but doesn't
actually catch a real bug (see Exercise E6) — a reminder that coverage
percentage and test quality are not the same thing.

## Scripts

- `npm run typecheck` — `tsc --noEmit` across the whole workspace.
- `npm run lint` — ESLint (flat config).
- `npm test` — the full Vitest suite.
- `npm run test:affected` — `vitest run --changed`, only the tests touched by
  your current (uncommitted or last-commit) change. Used by the example
  `Stop` hook in `exercises/reference/claude-code/`.
- `npm run check` — all three, in order.
