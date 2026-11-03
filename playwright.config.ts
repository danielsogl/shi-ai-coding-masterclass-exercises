import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "e2e/features/**/*.feature",
  steps: "e2e/steps/**/*.ts",
});

export default defineConfig({
  testDir,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  reporter: process.env["CI"] ? "github" : "list",
  use: {
    baseURL: "http://localhost:4200",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // API keeps tasks in memory, so a fresh server means fresh seed data.
  webServer: {
    command: "npm start",
    url: "http://localhost:4200",
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
  },
});
