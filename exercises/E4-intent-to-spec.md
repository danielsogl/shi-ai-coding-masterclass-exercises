# E4 — Intent → Spec → Tasks

**Module:** M2 · **Time box:** 20 min · **Proves:** SDD pipeline

## Goal

Practice the Intent → Spec → Tasks pipeline on a real feature before
writing any code. This spec is reused in Exercise E5 (turning it into
failing tests) and Capstone C2 (implementing it), so make it good.

## Starting state

`apps/api` currently has `GET /events/:id/availability`, which reports
`available` and `soldOut` but does nothing when an event is sold out
beyond reporting the fact. There is no waitlist.

## Steps

1. Copy `exercises/templates/spec.md` to
   `exercises/my-waitlist-spec.md` (or wherever your agent's working
   files live).
2. **Intent**: one paragraph — what should happen when someone tries to
   get a ticket for a sold-out event?
3. **Spec**: write the behavior and at least four Given-When-Then
   acceptance criteria. Cover: joining the waitlist on a sold-out event,
   being rejected/redirected on a non-sold-out event, and at least one edge
   case (duplicate join, empty queue, or similar — your choice).
4. **Non-goals**: explicitly state what you are NOT building yet (e.g.
   "no automatic notification when a spot opens up" — that can be a
   stretch goal or left for later).
5. **Tasks**: break the spec into small, commit-sized tasks.
6. Have your agent read the spec back to you in its own words. If it
   misunderstands something, that's a spec problem — fix the spec, not
   just the agent's understanding.

## Done when

- `exercises/my-waitlist-spec.md` has Intent, Spec (≥4 acceptance
  criteria), Non-goals, and Tasks, all filled in.
- Your agent can restate the spec accurately without you re-explaining it.

## Stretch

Write one acceptance criterion as a property ("for any event, the number
of waitlisted people never exceeds X") instead of a single example.

## In your own repo instead

Pick a small real feature you actually need. Same template, same steps.
