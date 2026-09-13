# Exercises

Hands-on exercises for the AI Coding Master Class, built around a small
conference-ticketing monorepo ("Tickets" — see the root `README.md` for
the codebase itself). Every exercise works with Claude Code or GitHub
Copilot; each one also names a one-line variant for using your own repo
instead.

## Prerequisites

Everything needed for E1-E4, E7, E8, and the capstones is covered by the
root `README.md`'s `npm ci`. Exercise E5 additionally installs the
`exercises/reference/claude-code/` hooks, which require `jq`
(`brew install jq` / `apt install jq`) — not preinstalled on stock macOS.

## How to work through these

- **In this repo**: clone it, `npm ci`, and work through the exercises in
  order — later ones build on earlier ones' output (E4's spec feeds E5 and
  C2; E3's characterization tests are a prerequisite for C3).
- **In your own repo**: every exercise card ends with an "in your own repo
  instead" line. The mechanics (spec templates, hook scripts, skill/agent
  examples) are copy-paste-able into any repo.
- You do not need to do every exercise in one sitting. Each card states
  its own time box and starting state so you can pick it up independently.

## Modules → exercises

| Exercise | Module | Time | What it proves |
|---|---|---|---|
| [E1](./E1-harness-inventory.md) | M1 | 15 min | harness ≠ model |
| [E2](./E2-context-hierarchy.md) | M2 | 20 min | context hierarchy |
| [E3](./E3-reverse-spec.md) | M2 | 20 min | brownfield reverse spec |
| [E4](./E4-intent-to-spec.md) | M2 | 20 min | SDD pipeline |
| [E5](./E5-red-green-hooks.md) | M3 | 30 min | red-green + golden rule |
| [E6](./E6-real-world-constraints.md) | M3 | 20 min | flaky tests, broken baselines, coverage theater |
| [E7](./E7-extend-your-harness.md) | M4 | 20 min | extension choice + context firewall |
| [E8](./E8-security.md) | M5 | 15 min | security + review gate |
| [C1](./C1-group-discount.md) | M6 | 60 min | full loop (easy) |
| [C2](./C2-waitlist.md) | M6 | 60 min | full loop (medium, continues E4) |
| [C3](./C3-refund.md) | M6 | 60 min | full loop, brownfield (hard, needs E3) |

## Templates

- [`templates/spec.md`](./templates/spec.md) — Intent / Spec (behavior +
  Given-When-Then acceptance criteria + non-goals) / Tasks. Used by E4, C2.
- [`templates/30-day-plan.md`](./templates/30-day-plan.md) — your personal
  adoption plan, filled in at the end (M6c).

## Reference material

- [`reference/claude-code/`](./reference/claude-code/) — example
  `settings.json` + hooks (a `Stop` hook running typecheck/tests, a
  `PreToolUse` hook denying edits to test files), an example skill, an
  example sub-agent. Used in E5 and E7.
- [`reference/copilot/`](./reference/copilot/) — the Copilot equivalents,
  and one honest gap (hooks are preview/JetBrains-scoped as of 2026-09 —
  see that folder's README before relying on it).

None of this reference material is wired into the starter repo by
default — you install it yourself as part of E5/E7, which is the point:
you should know what you're turning on and why.
