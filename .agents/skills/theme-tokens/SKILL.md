---
name: theme-tokens
description: Make a component readable in light and dark mode by replacing hard-coded colors with Angular Material system tokens. Use when a component looks wrong, too bright or unreadable in dark mode, or when someone asks to fix colors, contrast or theming in a component.
---

# Theme tokens

The app themes itself with Angular Material system tokens (`--mat-sys-*`).
A hard-coded color looks the same in light and dark mode, so it breaks one
of them.

1. Find the hard-coded colors in the component's styles: hex (`#fff`),
   `rgb(...)`, and names like `white` or `black`.
2. Replace each one with a token. Pick the pair, not a single value:
   - background `--mat-sys-surface-container-*`, text on it
     `--mat-sys-on-surface` or `--mat-sys-on-surface-variant`
   - status colors: `--mat-sys-error-container` with
     `--mat-sys-on-error-container` (same for `tertiary`, `secondary`)
3. Never put a token background under a hard-coded text color, or the
   other way round.
4. Run `npm run lint` and `npm test`. Then say which colors you replaced
   and which you left, and why.
