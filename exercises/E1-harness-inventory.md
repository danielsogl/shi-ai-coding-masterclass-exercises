# E1 — Harness inventory

**Module:** M1 · **Time box:** 15 min · **Proves:** harness ≠ model

## Goal

See, on your own machine, that the same model behaves differently depending
on the harness around it — permissions, context, and tools, not just the
weights.

## Starting state

A fresh clone of this repo (`npm ci` run, nothing else touched).

## Steps

1. Map your agent (Claude Code, Copilot, or whatever you use day to day) to
   the five harness axes from M1b: model, context, tools, feedback loops,
   permissions. One line each — what is it for your setup, right now?
2. Ask your agent the same question twice, in two different permission
   modes:
   - **Read-only / plan mode**: "Explain what `packages/pricing` does and
     how `calculateOrderTotalCents` combines group discount, promo code,
     and VAT."
   - **Act mode** (normal permissions): the same question.
3. Compare the two transcripts. Did the agent behave differently — did it
   run anything, propose edits, or explore more/less of the codebase?

## Done when

- You have a filled-in five-axis line for your own agent.
- You have two transcripts (read-only vs. act) and one written sentence on
  what actually differed between them.

## Stretch

Run the same question in a third mode if your tool has one (e.g. an `auto`
classifier mode, or a heavier "extended thinking"/reasoning-effort
setting). Does the axis mapping change again?

## In your own repo instead

Pick any module you understand well and ask your agent to explain it, once
read-only and once with normal permissions.
