import { Injectable, effect, signal } from "@angular/core";
import { colorSchemeFor } from "./color-scheme";

export type ThemeChoice = "system" | "light" | "dark";

const KEY = "theme";
const CHOICES: readonly ThemeChoice[] = ["system", "light", "dark"];

@Injectable({ providedIn: "root" })
export class ThemeService {
  readonly choice = signal<ThemeChoice>(this.read());

  constructor() {
    effect(() => {
      const choice = this.choice();
      document.documentElement.style.colorScheme = colorSchemeFor(choice);
      localStorage.setItem(KEY, choice);
    });
  }

  set(choice: ThemeChoice): void {
    this.choice.set(choice);
  }

  private read(): ThemeChoice {
    const stored = localStorage.getItem(KEY) as ThemeChoice;
    return CHOICES.includes(stored) ? stored : "system";
  }
}
