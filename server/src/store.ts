import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { taskSchema, type Task } from "./tasks.ts";

const seedFile = join(import.meta.dirname, "..", "data", "seed.json");

export class TaskStore {
  private readonly tasks = new Map<string, Task>();
  private nextId = 1;
  loaded = false;

  async load(): Promise<void> {
    const raw: unknown = JSON.parse(await readFile(seedFile, "utf8"));
    for (const task of taskSchema.array().parse(raw))
      this.tasks.set(task.id, task);
    this.nextId =
      Math.max(
        0,
        ...[...this.tasks.keys()].map(Number).filter(Number.isFinite),
      ) + 1;
    this.loaded = true;
  }

  list(): Task[] {
    return [...this.tasks.values()];
  }

  get(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(data: Omit<Task, "id">): Task {
    const task = { ...data, id: String(this.nextId++) };
    this.tasks.set(task.id, task);
    return task;
  }

  update(id: string, changes: Partial<Omit<Task, "id">>): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updated = { ...task, ...changes };
    this.tasks.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tasks.delete(id);
  }

  clear(): void {
    this.tasks.clear();
  }
}
