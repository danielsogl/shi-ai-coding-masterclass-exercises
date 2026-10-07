import { colorSchemeFor } from "./color-scheme";

describe("colorSchemeFor", () => {
  it("returns a color scheme for every choice", () => {
    for (const choice of ["system", "light", "dark"] as const) {
      expect(colorSchemeFor(choice)).toBeTruthy();
    }
  });
});
