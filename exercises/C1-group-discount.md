# C1 — Capstone: a new group discount tier

**Module:** M6 · **Time box:** 60 min · **Difficulty:** easy · **Proves:** full loop (Spec → Failing Test → Agent Loop → Review Gate → PR)

## Goal

Add a bigger-order discount tier to `packages/pricing`, end to end, using
the full gate sequence — not just "ask the agent to add a discount."

## Starting state

`packages/pricing/src/pricing.ts`: one group-discount tier today —
`GROUP_DISCOUNT_RATE` (10%) applies once `quantity >= GROUP_DISCOUNT_THRESHOLD`
(5). There is no tier beyond that.

## Spec

Add a second tier: orders of **20 or more** tickets get **15% off**
instead of 10%. Orders of 5-19 keep the existing 10%. Orders under 5 stay
undiscounted. The promo-code interaction in `discounts.ts` (codes only
apply to orders of `MAX_PROMO_QUANTITY` or fewer) is unaffected — it
already won't fire for a 20+ order.

Acceptance criteria:

- Given a quantity of 19, when pricing is calculated, then the 10% tier
  applies (unchanged behavior).
- Given a quantity of 20, when pricing is calculated, then the 15% tier
  applies.
- Given a quantity of 4, when pricing is calculated, then no group
  discount applies (unchanged behavior).

Non-goals: no third tier, no configurable/admin-editable thresholds — just
the two hardcoded tiers.

## Steps (gates)

1. **Spec** — the above is written for you; adjust it if you find a gap
   before you start.
2. **Failing test** — add the 20+ boundary cases to
   `packages/pricing/src/pricing.test.ts` first. Confirm they fail (RED)
   against the current single-tier implementation.
3. **Agent loop** — implement the second tier. Stay in the loop; don't
   accept a change you haven't read.
4. **Review gate** — before you consider this done, check: does
   `packages/pricing/src/discounts.test.ts` still pass unmodified? Did the
   agent touch anything outside `pricing.ts`/`pricing.test.ts`? Run
   `npm run check`.
5. **PR** — commit with a Conventional Commit message. If you're working
   in this repo directly, open a real PR (or a local commit is fine for
   the workshop).

## Done when

- New boundary tests exist and pass; the 19/4 cases still pass unchanged.
- `npm run check` is green (aside from this repo's one known-broken
  baseline test, which is unrelated — see `exercises/E6-real-world-constraints.md`).
- You went through spec → failing test → implementation → review → commit
  in that order, not implementation-first.

## Stretch

Make the thresholds and rates configurable via an `OrderInput` field
instead of hardcoded constants, without changing any existing call sites'
behavior.

## In your own repo instead

Pick any small, well-scoped rule change in code you own. Same five gates.
