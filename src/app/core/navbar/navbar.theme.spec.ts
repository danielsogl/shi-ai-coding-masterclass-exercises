import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { Navbar } from "./navbar";

describe("Navbar theme switch", () => {
  let fixture: ComponentFixture<Navbar>;
  let el: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.style.colorScheme = "";
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  const option = (name: string) =>
    Array.from(
      el.querySelectorAll<HTMLElement>("mat-button-toggle button, [role=radio]"),
    ).find((b) => b.textContent?.trim() === name);

  const active = (name: string) =>
    option(name)?.getAttribute("aria-pressed") ??
    option(name)?.getAttribute("aria-checked");

  it("AC1: the switch offers System, Light and Dark and shows System as active", () => {
    expect(option("System")).toBeTruthy();
    expect(option("Light")).toBeTruthy();
    expect(option("Dark")).toBeTruthy();
    expect(active("System")).toBe("true");
  });

  it("AC2: picking Dark turns the app dark at once and marks Dark active", () => {
    option("Dark")?.click();
    fixture.detectChanges();
    TestBed.tick();
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(active("Dark")).toBe("true");
  });

  it("AC7: the switch has an accessible name", () => {
    const group = el.querySelector(
      "[role=group], [role=radiogroup], mat-button-toggle-group",
    );
    expect(group).toBeTruthy();
    expect(group?.getAttribute("aria-label")).toBeTruthy();
  });
});
