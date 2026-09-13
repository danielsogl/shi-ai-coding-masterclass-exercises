# E8 — Security and the review gate

**Module:** M5 · **Time box:** 15 min · **Proves:** security + review gate

## Goal

Map where your agent setup has the "lethal trifecta" (private-data access +
untrusted-content exposure + an exfiltration channel), close the most
obvious hole, and write down what an agent-authored PR needs before you'll
merge it.

## Starting state

Your own agent setup (this repo has no secrets or MCP servers configured —
use your day-to-day setup for this one).

## Steps

1. **Map the trifecta.** For your actual setup, name: what private data
   your agent can read (env vars, cloud credentials, internal docs via
   MCP); what untrusted content it processes (web pages, issue/PR text,
   email, third-party MCP tool output); what exfiltration channels exist
   (network access, the ability to open URLs, an MCP tool that posts
   somewhere). If any single agent session has all three at once, that's
   the risk — name the specific session/config where it happens.
2. **Deny `.env*` reads.** Add a permission rule that denies reading
   `.env` and similar files, even though this repo doesn't have any yet.
   Claude Code: a `deny` rule in `.claude/settings.json` permissions
   (`"deny": ["Read(**/.env*)"]` or your version's equivalent syntax —
   check current docs, the syntax has changed across versions). Confirm it
   actually blocks a read attempt.
3. **Enable sandboxing.** Turn on whatever OS/process-level sandboxing
   your tool offers (Claude Code: `sandbox.enabled`; Codex CLI: its
   Seatbelt/Landlock sandbox is on by default; Copilot: check current
   docs for your surface). Note one thing that got slower or more
   annoying — sandboxing has a real cost, and pretending otherwise is how
   people turn it back off.
4. **Review-gate checklist.** Write a 5-8 item checklist for reviewing an
   agent-authored PR before merge. Include at least one item that is
   *not* also on your checklist for human-authored PRs (e.g. "does the
   diff touch files outside what the task asked for", "were tests added
   or just... described").

## Done when

- Your trifecta map names a real session/config in your own setup, not a
  hypothetical.
- The `.env*` deny rule is in place and you've confirmed it blocks a read.
- Sandboxing is on, with one honest note about its cost.
- The review-gate checklist exists and has at least one agent-specific item.

## Stretch

Find one MCP server or tool integration in your own setup that currently
has all three legs of the trifecta at once. Write down how you'd split it
so no single session has all three.

## In your own repo instead

Same four steps, against your actual working setup — this one is written
for that already.
