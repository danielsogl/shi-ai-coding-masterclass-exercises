# C3 — Capstone: a refund flow that doesn't repeat legacy-invoice's bugs

**Module:** M6 · **Time box:** 60 min · **Difficulty:** hard · **Proves:** full loop, brownfield

## Goal

Build a refund flow on top of `packages/legacy-invoice`, without silently
inheriting (or "fixing" without noticing) its existing surprising
behaviors. This is the hardest capstone because step zero is understanding
code you didn't write and have no docs for.

## Prerequisite

Do Exercise E3 first (or right now, if you skipped it) — you need
`packages/legacy-invoice/SPEC.md` and its characterization tests before
you touch this code. If you build C3 without E3, you will very likely
either reproduce a bug you didn't know was there, or "fix" one and break a
test elsewhere that depended on the old behavior.

## Starting state

`packages/legacy-invoice/src/invoice.ts` with `generateInvoice` and
`applyCreditNote`, plus whatever `SPEC.md`/characterization tests you
wrote in E3.

## Spec

Add `apps/api`'s `POST /invoices/:id/refund` (in-memory invoice store is
fine — extend the `/invoices` endpoint to store what it creates, keyed by
an incrementing id) accepting `{ amount: number }`:

- If `amount` is less than or equal to the invoice's current `total`,
  apply it via `applyCreditNote` and return the updated invoice.
- If `amount` exceeds the current `total`: **decide, explicitly, what
  should happen** — `applyCreditNote` today silently floors at zero and
  discards the excess (one of E3's surprising behaviors). Your API layer
  must not repeat that silently. Either reject the request (422, with a
  clear error) or return the discarded amount in the response so the
  caller can see it. Write down which you chose and why.
- The response must make it possible for a caller to tell how much credit
  was actually applied, distinct from how much was requested.

Non-goals: no partial-refund-across-multiple-line-items logic, no
integration with a real payment processor.

## Steps (gates)

1. **Spec** — the above, refined with your own acceptance criteria
   (Given-When-Then) for at least the three cases named.
2. **Failing test** — `apps/api/src/refund.test.ts` (or add to
   `server.test.ts`): the three cases above. Confirm RED.
3. **Agent loop** — implement. This is the step where "don't touch
   `invoice.ts`'s existing behavior without a reason" matters most — if
   your agent proposes changing `applyCreditNote` itself, that's a
   decision to make consciously (and re-run E3's characterization tests
   against it), not a side effect.
4. **Review gate** — did `packages/legacy-invoice/src/invoice.test.ts`
   (from E3) still pass unchanged, or did the agent alter it to match a
   changed implementation? If the latter, that's the golden rule
   violation from M3e — stop and reconsider. Run `npm run check`.
5. **PR** — Conventional Commit, or a real PR if you're set up for it.

## Done when

- The three refund cases have passing tests, including your explicit
  decision on the over-refund case.
- E3's characterization tests for `invoice.ts` still pass unchanged
  (unless you deliberately, consciously changed `invoice.ts` — in which
  case you also updated the characterization tests and can explain why).
- `npm run check` is green (aside from the one known-broken baseline
  test).

## Stretch

Store refund history per invoice (a list of `{amount, appliedAt}`) and add
`GET /invoices/:id` to show the running total alongside the refund log.

## In your own repo instead

Pick a feature that has to build on top of undocumented legacy code you
don't fully trust. Characterize first (E3-style), then build the feature
without touching the legacy code's behavior unless you decide to on
purpose.
