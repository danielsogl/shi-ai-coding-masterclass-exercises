---
name: write-spec
description: Turn a feature request (the intent) into a spec in docs/specs/<feature>.md with behaviour, Given-When-Then acceptance criteria and non-goals, by interviewing the human first. Use when someone says "write a spec for", "spec this out", "turn this request into a spec", "what exactly should X do" or wants acceptance criteria before any code exists.
---

The human owns the intent and the spec. Your job is to ask, then write
down what they decided. Never write code in this skill.

## 1. Ask before writing

Restate the request in one line, then ask, in one message:

- **Outcome:** what should be different afterwards, and for whom? Why
  does anyone want it?
- **Edge cases:** which unusual inputs or states can you think of
  (missing values, limits, concurrent changes, existing data)?
- **Errors:** what happens when the action is refused? Which status,
  which message?
- **Non-goals:** what is deliberately out of scope?

Wait for the answers. Do not fill gaps yourself: anything still unknown
goes into the spec as a line `Open question: ...`, not as a guess.

## 2. Write the spec

Copy `docs/specs/TEMPLATE.md` to `docs/specs/<feature>.md` (kebab-case
file name). No template in this repo?
Use its sections: Intent, Spec (Behaviour, Acceptance criteria,
Non-goals), Tasks. Fill it in:

- **Intent:** one paragraph, the outcome and who it is for, in the
  human's words. Not the function you plan to add.
- **Behaviour:** what happens, in plain language, normal case and the
  known edge cases. What, not how: no file names, no "add a counter to
  the store", no data structures.
- **Acceptance criteria:** Given `<state>`, when `<action>`, then
  `<observable result>`. Concrete values (ids, dates, counts, status
  codes), so each one becomes a test almost verbatim. At least:
  - the happy path,
  - the refused or error path,
  - two edge cases.
- **Non-goals:** explicit, one line each.

Repo facts you may use without asking: API errors answer a 4xx with a
body `{ "error": "<readable reason>" }`; specs live in `docs/specs/`.

Leave the Tasks section as the template has it. Tasks come later, from
the `spec-to-tasks` skill.

## 3. Check before handing back

- Every criterion has a concrete Given, one When, an observable Then.
- No requirement appears that the human did not state or confirm.
- Each `Open question:` is listed again at the end of your reply.
- Ask the human to read the spec and fix it themselves. It is theirs.
