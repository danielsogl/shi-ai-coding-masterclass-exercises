---
name: reverse-spec
description: Derive a spec from existing code that has no docs or tests (brownfield), describe its current behaviour as Given-When-Then with concrete inputs and outputs, flag surprising behaviour and propose characterisation tests. Use when someone says "what does this legacy code actually do", "reverse-engineer a spec", "document this module before we change it", "write characterisation tests" or points at a module or a set of files.
---

The code's current behaviour is the spec until a human decides
otherwise. Describe it; do not fix it. Never change the code in this
skill.

## 1. Read

- Read the target module fully: every export, every branch. Do not trust
  names or comments; check what the code does.
- Find the callers (search for the export names) and note what they pass
  in and what they do with the result. Include client code that writes
  the inputs (e.g. the board sets `completedAt`).
- Lots to read? If a research sub-agent is installed, let it
  do the reading and work from its summary.

## 2. Trace concrete inputs

For every branch, pick a concrete input and work out the output: by hand,
or by running the real module, not a copy of its logic. From the repo
root: `node -e "import('./path/x.ts').then((m) => console.log(m.fn(...)))"`
(Node 24 runs `.ts` directly). A longer scratch script goes in
`os.tmpdir()` and imports the module by absolute path. Never write
scratch files inside the repo. Include inputs the seed data never uses: missing
fields, end of month, end of year, boundaries.

## 3. Write the spec

Write `SPEC.md` next to the module, or where the human asks. If
`SPEC.md` already exists, write `SPEC.reverse.md` instead and compare
the two in your reply. Sections:

- **Purpose:** two or three sentences.
- **API:** each export, its signature, its callers.
- **Behaviour:** one Given-When-Then per branch, with the concrete input
  and the exact output you traced: Given `<input>`, when `<call>`,
  then `<exact output>`. Real values, not "a date in the future".
- **Surprises:** every behaviour a reasonable reader would not guess
  from the names, each on a line starting `SURPRISE:` with input and
  actual output. A throw on missing input and a switch of the base date
  are surprises too. "Looks fine" is not an answer: trace again.
- **Open questions:** what you could not determine.

Do not label a surprise a bug or quietly describe the "intended"
behaviour. Whether it is a bug or a rule is the human's decision.

## 4. Propose characterisation tests

One test per surprise and per branch, asserting the _current_ output.
The test name states the behaviour it pins, with the input in it. The
tests exist to detect change, not to declare the behaviour right.

Always propose them in your reply. If writes to `*.test.ts` /
`*.spec.ts` are blocked (deny rule or hook), do not work around it:
paste the test code in your reply and let the human create the file.
Then they run it (`npm run test:server`).
