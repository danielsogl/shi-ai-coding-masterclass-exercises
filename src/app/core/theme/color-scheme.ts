import type { ThemeChoice } from "./theme";

/** The value for the `color-scheme` CSS property on `<html>`. */
export function colorSchemeFor(choice: ThemeChoice): string {
  if (choice === "dark") return "dark";
  if (choice === "light") return "light";
  return "light dark";
}
