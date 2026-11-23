// Quality Gate vor „fertig“: Unit-Tests und fachliche Abnahme müssen grün sein.
// Rot schickt den Agenten mit den roten Testnamen zurück an die Arbeit.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");

// Höchstens drei Runden pro Session, dann entscheidet ein Mensch.
const counter = join(tmpdir(), `done-gate-${input.sessionId ?? input.session_id ?? "x"}`);
let rounds = 0;
try { rounds = Number(readFileSync(counter, "utf8")) || 0; } catch {}
if (rounds >= 3) process.exit(0);

const run = (script) =>
  spawnSync("npm", ["run", "--silent", script], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

const failing = [];
for (const script of ["test", "accept"]) {
  const r = run(script);
  if (r.status !== 0) {
    const all = `${r.stdout}${r.stderr}`.replace(/\x1b\[[0-9;]*m/g, "").split("\n");
    let lines = all.filter((l) => /×|✗|FAIL|Tests |Error/.test(l)).slice(0, 20);
    if (lines.length === 0) lines = all.filter(Boolean).slice(-10);
    failing.push(`npm run ${script} ist rot:\n${lines.join("\n")}`);
  }
}
if (failing.length === 0) process.exit(0);

writeFileSync(counter, String(rounds + 1));
console.log(
  JSON.stringify({
    decision: "block",
    reason: `Quality Gate rot, die Aufgabe ist noch nicht fertig.\n\n${failing.join("\n\n")}\n\nLies die roten Testnamen als Anforderungen und korrigiere den Code. Ändere keine Tests.`,
  }),
);
