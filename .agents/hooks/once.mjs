// Copilot reads hooks from .github/hooks and from .claude/settings.json and runs
// both. Let only the first run of an event in a session do the work.
// ponytail: a marker file in the temp dir; a lock service would be overkill.
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function once(name, input) {
  const session = input.session_id ?? input.sessionId ?? "none";
  const marker = join(tmpdir(), `agent-hook-${name}-${session}`);
  try {
    const age = Date.now() - statSync(marker).mtimeMs;
    const state = readFileSync(marker, "utf8");
    if ((state === "running" && age < 600_000) || age < 3_000) process.exit(0);
  } catch {
    // no marker yet: first run
  }
  writeFileSync(marker, "running");
  process.on("exit", () => writeFileSync(marker, "done"));
}
