# Task Board: AI Coding Master Class exercises

Starter repository for the hands-on exercises in the AI Coding Master
Class: a small task board with an Angular app and an Express API. The
exercises are described in the workshop slides. Across the workshop you
build a dark mode for this app with a coding agent of your choice
(Claude Code, Copilot, Codex, Junie, ...).

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

| Script                  | What it does                                         |
| ----------------------- | ---------------------------------------------------- |
| `npm start`             | API and Angular dev server together                  |
| `npm run typecheck`     | `tsc --noEmit` for the app, its specs and the server |
| `npm run lint`          | ESLint (angular-eslint, typescript-eslint)           |
| `npm test`              | `test:app`, then `test:server`                       |
| `npm run test:app`      | Angular unit tests (`ng test`, Vitest, run once)     |
| `npm run test:server`   | API tests (Vitest, Node)                             |
| `npm run test:affected` | only the tests related to your uncommitted change    |
| `npm run check`         | typecheck, lint and test, in that order              |
| `npm run accept:e1`     | the business acceptance check for exercise E1        |
| `npm run preflight`     | workshop readiness check                             |
