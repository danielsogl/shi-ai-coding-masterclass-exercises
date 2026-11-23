# Task Board: AI Coding Master Class exercises

Starter repository for the hands-on exercises in the AI Coding Master
Class: a small task board with an Angular app and an Express API. The
exercises are described in the workshop slides. Across the workshop you
build a dark mode for this app with a coding agent of your choice
(Claude Code, Copilot, Codex, Junie, ...).

## DATEV AI Skilling Days 2026: Vorher, nachher selbst ausprobieren

Dieser Branch (`demo/datev`) enthält die Demo aus dem Talk „Code, Culture &
Copilot“: Ein Agent meldet „fertig“, aber die fachliche Abnahme ist rot. Ein
Hook vor „fertig“ schickt ihn zurück, bis sie grün ist.

Was hier drin ist:

- `npm run accept`: die versteckte fachliche Abnahme für ein „Due soon“-Badge.
  Die Regeln stehen nur base64-kodiert in `scripts/accept.mjs`, wie bei echten
  Anforderungen, die niemand aufgeschrieben hat.
- `.github/hooks/hooks.json` und `.github/hooks/done-gate.mjs`: ein
  `agentStop`-Hook für GitHub Copilot. Er führt `npm test` und `npm run accept`
  aus und blockt bei Rot mit den roten Testnamen als Begründung, höchstens
  dreimal pro Session.

So läuft die Demo mit Copilot CLI:

```sh
git switch demo/datev
npm ci

# Vorher: ohne Hook
mv .github/hooks .github/hooks.off
copilot   # Prompt unten einfügen
npm run accept   # rot: zählt Kalendertage statt Werktage

# Nachher: mit Hook
git restore . && git clean -fd src && mv .github/hooks.off .github/hooks
copilot   # gleicher Prompt, den Ordner beim Start als vertrauenswürdig bestätigen
npm run accept   # grün
```

Der Prompt:

```text
Show a "Due soon" badge on task cards for tasks that are due within the next 3 days. Put the rule in a function isDueSoon(task, today) in src/app/features/tasks/util/task-helpers/task-helpers.ts, where today is a YYYY-MM-DD string.
```

Copilot lädt Repository-Hooks nur in vertrauenswürdigen Ordnern. Ohne
Bestätigung überspringt es `.github/hooks` mit einer Warnung. In VS Code sind
Agent-Hooks noch Preview. Wer den ganzen Harness sehen will (Hooks für Claude
Code, Copilot, Codex und Junie, Skills, Regeln): Branch `exercise/e6` und
folgende.

## Setup

Requires Node.js 24+ and Git.

```sh
npm ci
npm run preflight      # is this machine ready for the workshop?
npm start              # app on http://localhost:4200, API on :3000
```

`npm run preflight` checks Node, Git, the dependencies, an agent CLI and
the test suite. When it ends with "All set", post "ready" in the
workshop chat.

npm 11 may warn about "install scripts not yet covered by allowScripts"
during `npm ci`. That warning is harmless.

## Exercises

Every exercise starts from its own branch, so you can always join in:

```sh
git fetch origin
git switch -c my-e1 origin/exercise/e1
```

The slides name the branch for each exercise.

From E6 on, the branches carry agent hooks for Claude Code, Copilot, Codex
and Junie. Start a new session after switching branches. Codex asks you
to approve the hooks in `/hooks`. Junie CLI loads them only when started
with `junie --config-location .junie/config.json`.

Claude Code starts in auto mode by default. `.claude/settings.json` keeps
`git push` denied and asks before new packages or pull requests; auto mode
honours both. Auto mode's own rules (`autoMode`) are not read from project
settings, only from `~/.claude/settings.json`.

## What's in here

```
src/app/features/tasks/  Angular task board: NgRx Signals store, Material UI
src/app/core/            app shell: navbar, API config
server/src/              Express 5 API (/api/tasks), zod validation, in-memory store
server/data/seed.json    the tasks the API starts with
scripts/                 preflight and the E1 acceptance check
```

The Angular app reaches the API through the dev-server proxy
(`proxy.conf.json`). The API runs TypeScript directly on Node 24. It
starts with the seed data on every restart; nothing is persisted.

Some components still use hard-coded colors from before the app moved to
Material 3 tokens. That is on purpose: it is part of the dark mode work.

## Scripts

| Script                   | What it does                                         |
| ------------------------ | ---------------------------------------------------- |
| `npm start`              | API and Angular dev server together                  |
| `npm run typecheck`      | `tsc --noEmit` for the app, its specs and the server |
| `npm run lint`           | ESLint (+ Playwright rules), gplint for `.feature`   |
| `npm test`               | `test:app`, then `test:server`                       |
| `npm run test:app`       | Angular unit tests (`ng test`, Vitest, run once)     |
| `npm run test:server`    | API tests (Vitest, Node)                             |
| `npm run test:e2e`       | E2E tests (Playwright + playwright-bdd, Gherkin)     |
| `npm run test:e2e:steps` | sync E2E steps with `.feature` (rename, add stubs)   |
| `npm run test:affected`  | only the tests related to your uncommitted change    |
| `npm run check`          | typecheck, lint and test, in that order              |
| `npm run accept:e1`      | the business acceptance check for exercise E1        |
| `npm run preflight`      | workshop readiness check                             |
