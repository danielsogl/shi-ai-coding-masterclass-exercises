import { TestBed } from "@angular/core/testing";
import { ThemeService } from "./theme";

const KEY = "theme";

describe("ThemeService", () => {
  const create = () => TestBed.inject(ThemeService);

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.colorScheme = "";
  });

  it("AC1: without a stored choice the choice is System and the app follows the OS", () => {
    const service = create();
    TestBed.tick();
    expect(service.choice()).toBe("system");
    expect(document.documentElement.style.colorScheme).toBe("light dark");
  });

  it("AC2: picking Dark sets color-scheme dark on <html> without a reload", () => {
    const service = create();
    service.set("dark");
    TestBed.tick();
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("AC3: a stored Dark choice is read back on start", () => {
    localStorage.setItem(KEY, "dark");
    const service = create();
    TestBed.tick();
    expect(service.choice()).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("AC3: the choice is stored in localStorage", () => {
    create().set("dark");
    TestBed.tick();
    expect(localStorage.getItem(KEY)).toBe("dark");
  });

  it("AC4: a stored Light choice sets color-scheme light regardless of the OS", () => {
    localStorage.setItem(KEY, "light");
    create();
    TestBed.tick();
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("AC5: picking System after Dark follows the OS again and stores System", () => {
    const service = create();
    service.set("dark");
    service.set("system");
    TestBed.tick();
    expect(document.documentElement.style.colorScheme).toBe("light dark");
    expect(localStorage.getItem(KEY)).toBe("system");
  });

  it("AC6: an unknown stored value behaves as System", () => {
    localStorage.setItem(KEY, "blue");
    const service = create();
    TestBed.tick();
    expect(service.choice()).toBe("system");
    expect(document.documentElement.style.colorScheme).toBe("light dark");
  });
});
