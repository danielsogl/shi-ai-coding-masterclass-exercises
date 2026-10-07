import { colorSchemeFor } from "./color-scheme";

describe("colorSchemeFor", () => {
  it("returns a color scheme for every choice", () => {
    for (const choice of ["system", "light", "dark"] as const) {
      expect(colorSchemeFor(choice)).toBeTruthy();
    }
  });

  it("maps each choice to its color scheme", () => {
    expect(colorSchemeFor("light")).toBe("light");
    expect(colorSchemeFor("dark")).toBe("dark");
    expect(colorSchemeFor("system")).toBe("light dark");
  });
});
