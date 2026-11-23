// Fachliche Abnahme: `npm run accept`.
// Schreibt die Abnahmetests neben task-helpers.ts, führt sie einmal aus und löscht sie wieder.
// Base64, damit eine Suche nach den Regeln nichts findet.
import { spawnSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const root = join(import.meta.dirname, "..");
const spec = join(root, "src/app/features/tasks/util/task-helpers/due-soon.acceptance.spec.ts");
const source = "aW1wb3J0IHsgaXNEdWVTb29uIH0gZnJvbSAiLi90YXNrLWhlbHBlcnMiOwppbXBvcnQgeyBUYXNrIH0gZnJvbSAiLi4vLi4vZGF0YS9tb2RlbHMvdGFzay5tb2RlbCI7CgovLyBGYWNobGljaGUgUmVnZWxuIGbDvHIgIkR1ZSBzb29uIi4gTmllbWFuZCBoYXQgc2llIGF1Zmdlc2NocmllYmVuLgpjb25zdCB0YXNrID0gKGR1ZURhdGU6IHN0cmluZyB8IHVuZGVmaW5lZCwgc3RhdHVzOiBUYXNrWyJzdGF0dXMiXSA9ICJ0b2RvIik6IFRhc2sgPT4gKHsKICBpZDogIjEiLCB0aXRsZTogIlQiLCBkZXNjcmlwdGlvbjogIiIsIHN0YXR1cywgcHJpb3JpdHk6ICJtZWRpdW0iLCBkdWVEYXRlLCBjcmVhdGVkQXQ6ICIyMDI2LTExLTAxIiwgb3JkZXI6IDAsCn0pOwoKZGVzY3JpYmUoIkR1ZSBzb29uIChhY2NlcHRhbmNlKSIsICgpID0+IHsKICBpdCgiY291bnRzIHdvcmtpbmcgZGF5cywgbm90IGNhbGVuZGFyIGRheXMgKEZyaWRheSB0byBXZWRuZXNkYXkgaXMgMyB3b3JraW5nIGRheXMpIiwgKCkgPT4gewogICAgZXhwZWN0KGlzRHVlU29vbih0YXNrKCIyMDI2LTExLTI1IiksICIyMDI2LTExLTIwIikpLnRvQmUodHJ1ZSk7CiAgfSk7CgogIGl0KCJhIGRlYWRsaW5lIDQgd29ya2luZyBkYXlzIGF3YXkgaXMgbm90IGR1ZSBzb29uLCBldmVuIGFjcm9zcyBhIHdlZWtlbmQiLCAoKSA9PiB7CiAgICBleHBlY3QoaXNEdWVTb29uKHRhc2soIjIwMjYtMTEtMjYiKSwgIjIwMjYtMTEtMjAiKSkudG9CZShmYWxzZSk7CiAgfSk7CgogIGl0KCJhIHRhc2sgZHVlIHRvZGF5IGlzIGR1ZSBzb29uIiwgKCkgPT4gewogICAgZXhwZWN0KGlzRHVlU29vbih0YXNrKCIyMDI2LTExLTI0IiksICIyMDI2LTExLTI0IikpLnRvQmUodHJ1ZSk7CiAgfSk7CgogIGl0KCJvdmVyZHVlIHRhc2tzIGFyZSBvdmVyZHVlLCBub3QgZHVlIHNvb24iLCAoKSA9PiB7CiAgICBleHBlY3QoaXNEdWVTb29uKHRhc2soIjIwMjYtMTEtMjMiKSwgIjIwMjYtMTEtMjQiKSkudG9CZShmYWxzZSk7CiAgfSk7CgogIGl0KCJjb21wbGV0ZWQgdGFza3MgYW5kIHRhc2tzIHdpdGhvdXQgYSBkdWUgZGF0ZSBhcmUgbmV2ZXIgZHVlIHNvb24iLCAoKSA9PiB7CiAgICBleHBlY3QoaXNEdWVTb29uKHRhc2soIjIwMjYtMTEtMjUiLCAiY29tcGxldGVkIiksICIyMDI2LTExLTI0IikpLnRvQmUoZmFsc2UpOwogICAgZXhwZWN0KGlzRHVlU29vbih0YXNrKHVuZGVmaW5lZCksICIyMDI2LTExLTI0IikpLnRvQmUoZmFsc2UpOwogIH0pOwp9KTsK";
writeFileSync(spec, Buffer.from(source, "base64").toString("utf8"));
const ng = join(root, "node_modules", "@angular", "cli", "bin", "ng.js");
const result = spawnSync(
  process.execPath,
  [ng, "test", "--watch=false", "--include", "src/app/features/tasks/util/task-helpers/due-soon.acceptance.spec.ts"],
  { cwd: root, stdio: "inherit" },
);
rmSync(spec, { force: true });
process.exit(result.status ?? 1);
