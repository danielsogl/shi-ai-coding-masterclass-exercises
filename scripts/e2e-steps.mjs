// Syncs E2E step definitions with the .feature files:
// - A step whose text changed is renamed in place, so its implementation is
//   kept (bddgen reports the old definition as unused, the new text as missing;
//   they pair up by keyword and number of {parameters}).
// - Any other missing step is added to e2e/steps/<feature>.steps.ts (created if
//   needed) as a stub that throws "Not implemented", so it can't pass by accident.
// - Step definitions left unused afterwards are listed.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (bin, args) =>
  spawnSync(process.execPath, [join(root, "node_modules", bin), ...args], {
    cwd: root,
    encoding: "utf8",
  });
const bddgen = (...args) => run("playwright-bdd/dist/cli/index.js", args);
const paramCount = (expression) => expression.match(/\{[^}]*\}/g)?.length ?? 0;
const unusedSteps = () =>
  [
    ...bddgen("export", "--unused-steps").stdout.matchAll(
      /^│ (Given|When|Then) (.*?) +│ (\S+):(\d+) +│$/gm,
    ),
  ].map(([, keyword, expression, file, line]) => ({
    keyword,
    expression,
    file: join(root, file),
    line: Number(line),
  }));

const gen = bddgen();
if (gen.status === 0) {
  console.log("No missing steps.");
  process.exit(0);
}
const missing = [
  ...gen.stderr.matchAll(
    /^(Given|When|Then)\('(.*)', async \(\{\}(.*)\n([\s\S]*?)\/\/ From: (\S+?):\d+:\d+\n\}\);$/gm,
  ),
];
if (missing.length === 0) {
  process.stderr.write(gen.stderr + gen.stdout);
  process.exit(gen.status ?? 1);
}

const unused = unusedSteps();
const sources = new Map();
const read = (file) => {
  if (!sources.has(file))
    sources.set(
      file,
      existsSync(file)
        ? readFileSync(file, "utf8")
        : 'import { createBdd } from "playwright-bdd";\n\nconst {} = createBdd();\n',
    );
  return sources.get(file);
};
const stubs = new Map();
const seen = new Set();

for (const [, keyword, expression, params, comments, from] of missing) {
  if (seen.has(expression)) continue;
  seen.add(expression);
  const target = join(
    root,
    "e2e/steps",
    basename(from, ".feature") + ".steps.ts",
  );

  // Renamed step? Prefer an unused definition in the feature's own steps file.
  const candidates = unused.filter(
    (u) =>
      u.keyword === keyword &&
      paramCount(u.expression) === paramCount(expression),
  );
  const old = candidates.find((u) => u.file === target) ?? candidates[0];
  if (old) {
    unused.splice(unused.indexOf(old), 1);
    const source = read(old.file);
    // Offset of the definition's line; its first string literal is the expression.
    const start = source
      .split("\n")
      .slice(0, old.line - 1)
      .join("\n").length;
    const rest = source
      .slice(start)
      .replace(/(["'`])(?:\\.|(?!\1).)*\1/, JSON.stringify(expression));
    sources.set(old.file, source.slice(0, start) + rest);
    console.log(
      `renamed  ${keyword} "${old.expression}" -> "${expression}" (${old.file.slice(root.length + 1)}:${old.line})`,
    );
    continue;
  }

  const code =
    `${keyword}('${expression}', async ({ page }${params}\n` +
    `${comments}// From: ${from}\n` +
    `  throw new Error("Not implemented");\n});\n`;
  stubs.set(target, [...(stubs.get(target) ?? []), { keyword, code }]);
  console.log(
    `added    ${keyword} "${expression}" (${target.slice(root.length + 1)})`,
  );
}

for (const [file, steps] of stubs) {
  // Make sure every keyword the new steps use is destructured from createBdd().
  const source = read(file).replace(
    /const \{([^}]*)\} = createBdd\(\);/,
    (_, names) => {
      const all = new Set(
        names
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
      );
      for (const { keyword } of steps) all.add(keyword);
      const order = ["Given", "When", "Then"];
      const sorted = [...all].sort(
        (a, b) => order.indexOf(a) - order.indexOf(b),
      );
      return `const { ${sorted.join(", ")} } = createBdd();`;
    },
  );
  sources.set(file, `${source}\n${steps.map((s) => s.code).join("\n")}`);
}

for (const [file, source] of sources) writeFileSync(file, source);
run("prettier/bin/prettier.cjs", ["--write", ...sources.keys()]);

for (const u of unusedSteps())
  console.log(
    `unused   ${u.keyword} "${u.expression}" (${u.file.slice(root.length + 1)}:${u.line}), delete it if no longer needed`,
  );
