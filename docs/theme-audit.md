# Theme audit: hard-coded colors in `src/`

The app follows the OS setting through `color-scheme: light dark` in
`src/styles.scss`. Everything that uses `var(--mat-sys-*)` switches with it.
Hard-coded colors do not. Checked by reading the code and with screenshots
of `/board` in light and dark mode.

| File:line                 | Value                                  | Dark mode                                                                                                                                    |
| ------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `task-card.scss:5`        | card background `#ffffff`              | Cards stay white on a dark board. Date and assignee chips (token colors) turn light and almost disappear.                                    |
| `task-card.scss:109`      | title `#1f2937`                        | Readable on white cards. Invisible on the overdue card, which has a dark red token background.                                               |
| `task-card.scss:116`      | description `#6b7280`                  | Readable on white cards, dim on the overdue card.                                                                                            |
| `task-column.scss:59`     | column title `#111827`                 | Invisible: near-black on a dark column.                                                                                                      |
| `dashboard-stats.scss:14` | stat card background `#f7f8fa`         | To do, In progress, Done and Complete stay pale with light text: unreadable. Total and Overdue have their own token background and are fine. |
| `priority-badge.ts:35-52` | three badge color pairs                | Readable, but pastel pills on a dark board.                                                                                                  |
| `navbar.scss:21-22, 67`   | `black` in a mask, translucent `white` | Fine: only used as alpha.                                                                                                                    |
| `index.html:8`            | `theme-color` meta `#0060a8`           | Cosmetic: the browser bar stays blue.                                                                                                        |

Not counted: `src/theme/_theme-colors.scss`, the generated Material palette.

## Breaks in dark mode

1. Column titles are invisible.
2. Four of six stat cards are unreadable.
3. Task cards stay white; their chips and the overdue title disappear.
