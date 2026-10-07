// After every file edit: lint the changed files and report problems back.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { once } from "./once.mjs";

const input = JSON.parse(readFileSync(0, "utf8"));
once("lint", input);
let args = input.tool_input ?? input.toolArgs ?? {};
if (typeof args === "string") {
  try {
    args = JSON.parse(args);
  } catch {
    args = { command: args }; // raw patch text
  }
}
const files = [args.file_path ?? args.path ?? args.filePath];
// apply_patch (Codex, some Copilot models): the paths are in the patch text.
const patch = typeof args.command === "string" ? args.command : (args.input ?? "");
for (const m of String(patch).matchAll(/^\*\*\* (?:Add File|Update File|Move to): (.+)$/gm)) {
  files.push(m[1].trim());
}
const lintable = files.filter((f) => typeof f === "string" && /\.(ts|html)$/.test(f));
if (lintable.length === 0) process.exit(0);

const run = spawnSync("npx", ["eslint", ...lintable], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
if (run.status === 0) process.exit(0);

const reason = `Lint errors in ${lintable.join(", ")}:\n${run.stdout}${run.stderr}`;
if (input.toolName !== undefined) {
  // Copilot (.github/hooks): it reads additionalContext from stdout.
  console.log(JSON.stringify({ additionalContext: reason }));
  process.exit(0);
}
console.error(reason); // Claude Code and Codex: exit 2 + stderr
process.exit(2);
