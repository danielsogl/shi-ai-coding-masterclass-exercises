# C2 — Capstone: waitlist for sold-out events

**Module:** M6 · **Time box:** 60 min · **Difficulty:** medium · **Proves:** full loop, spanning packages + api

## Goal

Implement the waitlist feature specified in Exercise E4, touching both
`apps/api` and (if your spec calls for it) `packages/pricing`, through the
full spec → test → implement → review → PR loop.

## Starting state

If you completed E4: `exercises/my-waitlist-spec.md`. If not, use this
baseline spec (adjust as needed):

> When `GET /events/:id/availability` reports `soldOut: true`, a new
> endpoint `POST /events/:id/waitlist` accepts `{ name: string }` and adds
> the person to that event's waitlist, returning their position (1-based).
> Joining the waitlist for an event that is NOT sold out returns 409.
> Joining twice with the same name returns their existing position instead
> of a duplicate entry. A new `GET /events/:id/waitlist` returns the
> current list length.

## Steps (gates)

1. **Spec** — use yours from E4, or the baseline above. Either way, read
   it once more before starting and fix anything ambiguous.
2. **Failing test** — write `apps/api/src/waitlist.test.ts` (or add to
   `server.test.ts`) covering: join when sold out (success), join when not
   sold out (409), duplicate join (same position, no duplicate), waitlist
   length. Confirm RED.
3. **Agent loop** — implement. Decide where state lives (in-memory is
   fine for this exercise, same pattern as `seedEvents` in `server.ts`)
   and how it's wired into `createApp()`.
4. **Review gate** — does the new code follow the existing route-handling
   pattern in `server.ts`, or did the agent invent a parallel structure?
   Is validation at the boundary (missing `name`, unknown event id)
   actually handled, not just the happy path? Run `npm run check`.
5. **PR** — Conventional Commit, or a real PR if you're set up for it.

## Done when

- All acceptance criteria from your spec have a passing test.
- `npm run check` is green (aside from the one known-broken baseline
  test).
- The new endpoints follow the existing code's conventions (in-memory
  store, `sendJson` helper, same error-shape style) rather than
  introducing a second style.

## Stretch

Add a `DELETE /events/:id/waitlist` to let someone leave the queue, with a
test for what happens to the positions of everyone behind them.

## In your own repo instead

Take any feature you already spec'd (in E4 or elsewhere) and run it
through the same five gates.
