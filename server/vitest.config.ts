import { defineConfig } from "vitest/config";

export default defineConfig({
  // Nothing in the tests reads .env. Without this, a sandbox that denies .env
  // makes Vite's env loading fail the whole run.
  envDir: false,
  test: {
    root: import.meta.dirname,
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
