# Spec: Dark mode

## Intent

People use the board for hours, often in the evening or next to other dark
tools. Today the app follows the operating system's light or dark setting,
and nobody can override it. A user who wants the board dark on a light
system (or the other way round) should be able to choose, once, and keep
that choice the next time they open the app.

## Spec

### Behavior

The toolbar has a theme switch with three options: **System**, **Light** and
**Dark**. System is the default and behaves as today: the app follows the
operating system. Light and Dark override it. The choice applies at once to
the whole app, including dialogs and menus, without a reload. It is stored in
the browser, so it survives a reload and a new tab. A stored value the app
does not know is treated as System. The switch shows which option is active
and is usable with the keyboard and a screen reader.

### Acceptance criteria (Given-When-Then)

- AC1: Given no stored choice, when the app starts, then the theme follows the
  operating system and the switch shows System.
- AC2: Given the app is light, when the user picks Dark, then the whole app,
  including an open dialog, turns dark without a reload.
- AC3: Given the user picked Dark, when they reload the page, then the app
  starts dark and the switch shows Dark.
- AC4: Given the operating system is dark and the user picked Light, when the
  app starts, then it is light.
- AC5: Given the user picked Dark, when they pick System, then the app follows
  the operating system again and the stored choice is System.
- AC6: Given the stored value is unknown (e.g. "blue"), when the app starts,
  then it behaves as System.
- AC7: Given a keyboard-only user, when they tab to the switch, then they can
  open it, choose an option with the arrow keys and Enter, and a screen reader
  announces the switch's name and the selected option.

### Non-goals

- No per-user setting on the server; the choice lives in this browser only.
- No custom colors or accent picker; only light and dark of the existing theme.
- No scheduled switching (e.g. dark after sunset).
- Fixing the hard-coded colors in existing components. That is a separate
  change, listed in `docs/theme-audit.md`.

## Tasks

- [x] Failing unit tests for a theme service: default System, Light/Dark set
      `color-scheme` on `<html>`, choice stored and read back, unknown value
      treated as System (AC1, AC3, AC5, AC6).
- [x] Theme service in `src/app/core/theme/`: a signal with the current
      choice, applied to `document.documentElement.style.colorScheme`, stored
      in `localStorage` under one key (AC1–AC6).
- [x] Failing component test for the toolbar switch: shows the active option,
      picking an option calls the service, accessible name present (AC2, AC7).
- [x] Theme switch in `src/app/core/navbar/` (Material button toggle or menu)
      wired to the service (AC2, AC7).
- [x] `npm run check` green.
