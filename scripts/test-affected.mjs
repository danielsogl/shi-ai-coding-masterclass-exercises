// Fast, best-effort test run for the current change (uncommitted and untracked
// files): server tests through `vitest --changed` (all of them when
// server/data/ changed), app specs in the folders of the changed files under
// src/ (all of them when none of those folders has a spec). Extra arguments
// (e.g. -t <pattern>) go to the server run. Exits non-zero if any run fails.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const git = (...args) =>
  spawnSync("git", args, { cwd: root, encoding: "utf8" })
    .stdout.split("\n")
    .filter(Boolean);
const changed = [
  ...git("diff", "--name-only", "HEAD"),
  ...git("ls-files", "--others", "--exclude-standard"),
];

// Root config (package.json, tsconfig, angular.json, ...) can affect everything.
const everything = changed.some(
  (f) => !f.includes("/") && /\.(json|ts|mjs)$/.test(f),
);
const server = everything || changed.some((f) => f.startsWith("server/"));
// Any file under src/ counts (templates and styles too), mapped to its folder.
const app = changed
  .filter((f) => f.startsWith("src/"))
  .map((f) => posix.relative("src", posix.dirname(f)));
// `ng test --include <dir>` fails with "No tests found" on a folder without
// specs (models, most components), so keep only folders that have one.
const specDirs = [...new Set(app)].filter(
  (dir) =>
    existsSync(join(root, "src", dir)) &&
    readdirSync(join(root, "src", dir), { recursive: true }).some((f) =>
      String(f).endsWith(".spec.ts"),
    ),
);
// A changed seed (server/data/) is not imported, so --changed misses it.
const serverAll =
  everything || changed.some((f) => f.startsWith("server/data/"));

const node = (bin, args) =>
  spawnSync(process.execPath, [join(root, "node_modules", ...bin), ...args], {
    cwd: root,
    stdio: "inherit",
  }).status ?? 1;

let status = 0;
if (everything || app.length) {
  const include = everything
    ? []
    : specDirs.flatMap((dir) => ["--include", dir || "."]);
  status ||= node(
    ["@angular", "cli", "bin", "ng.js"],
    ["test", "--watch=false", ...include],
  );
}
if (server) {
  const changedOnly = serverAll ? [] : ["--changed"];
  status ||= node(
    ["vitest", "vitest.mjs"],
    [
      "run",
      "--config",
      "server/vitest.config.ts",
      ...changedOnly,
      ...process.argv.slice(2),
    ],
  );
}
if (!everything && !app.length && !server)
  console.log("test:affected: no changed source files, nothing to run.");
process.exit(status);
