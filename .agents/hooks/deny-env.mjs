// Before a tool runs: refuse .env files and `git push` (the E8 rule for Copilot).
// It looks at the tool's path and at the words of a shell command. A program that builds
// the path itself, such as `node -e`, gets past it; only a sandbox stops that. In VS Code
// the sandbox cannot protect files inside the workspace, so this hook is the only guard there.
// Hooks fail open on a timeout.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
let args = input.tool_input ?? input.toolArgs ?? {};
if (typeof args === "string") {
  try {
    args = JSON.parse(args);
  } catch {
    args = {};
  }
}
const isSecret = (p) => /(^|[\\/])\.env(\.[^\\/]*)?$/.test(p) && !p.endsWith(".example");
const command = String(args.command ?? "");
if (/\bgit\s+push\b/.test(command)) {
  console.error("git push is not allowed: your work stays local in this workshop.");
  process.exit(2);
}
const secret = command.split(/[\s"'`=;|&<>(),]+/).find(isSecret);
if (secret) {
  console.error(`Reading ${secret} is not allowed: it holds secrets.`);
  process.exit(2);
}
const file = String(args.file_path ?? args.path ?? args.filePath ?? "");
if (!isSecret(file)) process.exit(0);
console.error(`Reading ${file} is not allowed: it holds secrets.`);
process.exit(2);
