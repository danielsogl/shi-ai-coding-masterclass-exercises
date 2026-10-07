// When the agent says it is done: run the tests again. Red sends it back.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { once } from "./once.mjs";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
if (input.stop_hook_active) process.exit(0); // already sent back once
once("verify", input);

const run = spawnSync("npm", ["test"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
if (run.status === 0) process.exit(0);

const summary = `${run.stdout}${run.stderr}`
  .replace(/\x1b\[[0-9;]*m/g, "")
  .split("\n")
  .filter((line) => /Test Files|Tests |FAIL|×|Error/.test(line))
  .join("\n");
// Claude Code, Copilot, Codex and Junie all read this JSON on stdout.
console.log(
  JSON.stringify({
    decision: "block",
    reason: `npm test fails. Fix it before you finish:\n${summary}`,
  }),
);
