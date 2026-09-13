# E7 — Extend your harness

**Module:** M4 · **Time box:** 20 min · **Proves:** extension choice + context firewall

## Goal

Practice choosing the right extension mechanism instead of defaulting to
"paste more into the prompt": turn a repeated instruction into a skill,
apply the CLI-vs-MCP decision tree to a concrete case, and use a sub-agent
to keep noisy investigation out of your main context.

## Starting state

Whatever instructions you've been retyping across E1-E6 (e.g. "read this
legacy file and summarize the surprising behavior without touching it").

## Steps

1. **Skill.** Pick one instruction you've typed more than once in this
   workshop. Turn it into a project skill. Claude Code:
   `.claude/skills/<name>/SKILL.md` (see
   `exercises/reference/claude-code/skills/legacy-summary/SKILL.md` for a
   worked example doing exactly this for legacy-invoice research).
   Copilot: `.github/skills/<name>/SKILL.md`, same format — see
   `exercises/reference/copilot/skills/legacy-summary/SKILL.md` for the
   current scope caveat.
2. **CLI vs. MCP.** You need to fetch live exchange rates for
   multi-currency ticket pricing. Walk the decision tree: Does the agent
   need this constantly across many tasks, or once for a specific job? Is
   there already a well-behaved CLI for it? Does it need to hold
   state/session across calls? Write two sentences: which you'd pick (a
   one-off CLI call the agent shells out to, or an MCP server) and why —
   for *this* use case specifically, not in general.
3. **Context firewall.** Use a sub-agent to research `legacy-invoice`
   instead of doing it inline. Claude Code:
   `exercises/reference/claude-code/agents/legacy-researcher.md`. Copilot:
   `exercises/reference/copilot/agents/legacy-researcher.agent.md`. Confirm
   only the final summary lands in your main conversation — check your
   main session's context/token usage before and after, or just notice
   that you never saw the sub-agent's intermediate file reads.

## Done when

- One real, reusable skill file exists and you've invoked it at least
  once.
- You have a one-paragraph CLI-vs-MCP decision with a reason tied to the
  exchange-rate scenario, not a generic "it depends."
- You've run the `legacy-researcher` sub-agent/agent and can point to what
  did *not* end up in your main context as a result.

## Stretch

Find a second repeated instruction and skill-ify it too. Two data points
make "this is worth automating" a pattern instead of a one-off.

## In your own repo instead

Same three steps, using an instruction, an integration, and an
investigation task from your actual work.
