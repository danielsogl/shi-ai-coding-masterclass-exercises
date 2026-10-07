// Preflight: run `npm run preflight` once before the workshop starts.
// One line per check; exits non-zero if something required is missing.
import { spawnSync } from "node:child_process";
import console from "node:console";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const win = process.platform === "win32";
let failed = 0;

const ok = (msg) => console.log(`  ok    ${msg}`);
const note = (msg) => console.log(`  note  ${msg}`);
const fail = (msg) => {
  failed++;
  console.log(`  FAIL  ${msg}`);
};
// `shell` on Windows: git and the agent CLIs are .cmd/.exe shims there.
const run = (cmd, args) =>
  spawnSync(cmd, args, { cwd: root, encoding: "utf8", shell: win });

console.log("AI Coding Master Class: preflight\n");

const want = Number(
  JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
  ).engines.node.match(/\d+/)[0],
);
const have = Number(process.versions.node.split(".")[0]);
if (have >= want) ok(`Node ${process.versions.node}`);
else fail(`Node ${process.versions.node}, need ${want} or newer`);

if (run("git", ["--version"]).status === 0) ok("Git");
else fail("Git not found on PATH");

const installed = ["vitest", "@angular/cli", "express"].every((dep) =>
  existsSync(join(root, "node_modules", dep)),
);
if (installed) ok("dependencies installed");
else fail("dependencies missing: run `npm ci` first");

const agents = [
  ["claude", "Claude Code"],
  ["copilot", "GitHub Copilot CLI"],
  ["codex", "Codex"],
  ["junie", "Junie CLI"],
].filter(([bin]) => run(bin, ["--version"]).status === 0);
if (agents.length)
  ok(`agent CLI: ${agents.map(([, name]) => name).join(", ")}`);
else note("no agent CLI on PATH (fine if you work in an IDE)");

if (installed) {
  const tests = run("npm", ["test"]);
  if (tests.status === 0) ok("all tests green");
  else fail("tests failed: run `npm test` and post the output in the chat");
}

console.log(
  failed
    ? `\n${failed} check(s) failed. Fix them or say so in the chat.`
    : '\nAll set. Post "ready" in the chat.',
);
process.exit(failed ? 1 : 0);
