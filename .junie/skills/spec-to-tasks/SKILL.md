---
name: spec-to-tasks
description: Break an existing spec file into small, commit-sized tasks, each tied to an acceptance criterion and ordered test-first, and report where the spec is ambiguous. Use when someone says "turn this spec into tasks", "plan the tasks for docs/specs/<feature>.md", "break this down", "what are the steps to build this spec" or wants a task list before implementing.
---

You propose the tasks; the human accepts them. Do not write code in this
skill.

## 1. Read only the spec and the code

- Read the spec file the human names (usually `docs/specs/<feature>.md`).
  No spec named? Ask for one; do not plan from a chat message.
- Read the source code the change touches: routes, schemas, stores,
  components, the existing tests next to them.
- If the spec does not say something, the plan does not know it.

## 2. Find the gaps first

Before planning, list every place where the spec allows more than one
reading: an undefined term, a missing error case, two criteria that
contradict, a state no criterion covers. Do not pick an interpretation.
Report each gap as a question and say: fix the spec, not the task list.

## 3. Propose tasks

Commit-sized: one task, one commit, reviewable on its own. For each:

- **What:** the change in one line.
- **Files:** the files it touches.
- **Criterion:** which acceptance criterion (or criteria) it satisfies.
  A task that serves none is either setup (say so) or out of scope.
- **Verify:** how you know it is done: the test that turns green, the
  command, or the manual check.

Order them test-first: where a criterion exists, the task that writes
its failing test comes before the task that makes it pass. If writes to
`*.test.ts` / `*.spec.ts` are blocked, the test task is the human's:
mark it so.

Check: every criterion maps to at least one task, and no task does
something the non-goals exclude.

## 4. Hand back

Show the gaps, then the tasks, and stop. Write the accepted tasks into
the spec's `## Tasks` section as `- [ ]` items only after the human says
which ones they accept. Change nothing else in the spec; if the human
fixes a gap, they edit the spec and you re-plan.

## 5. Update the task list

- After the human accepts tasks, write them into the `## Tasks` section of
  the spec. Do this yourself; do not leave it to the human.
- Mark completed tasks with `- [x]` and new tasks with `- [ ]`.
- Do not change any other part of the spec.
