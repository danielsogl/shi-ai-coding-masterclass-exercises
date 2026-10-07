// Session start: run the tests once and tell the agent how the repo looks
// before it changes anything.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { once } from "./once.mjs";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
once("baseline", input);

const run = spawnSync("npm", ["test"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
const summary = `${run.stdout}${run.stderr}`
  .replace(/\x1b\[[0-9;]*m/g, "")
  .split("\n")
  .filter((line) => /Test Files|Tests |FAIL|×/.test(line))
  .join("\n");
const message =
  run.status === 0
    ? "Baseline before your work: npm test is green."
    : `Baseline before your work: npm test already fails.\n${summary}`;
// Copilot (.github/hooks, camelCase input) reads only JSON with additionalContext;
// Claude Code and Codex take plain text.
console.log(input.sessionId !== undefined ? JSON.stringify({ additionalContext: message }) : message);
