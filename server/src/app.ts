import express, {
  type ErrorRequestHandler,
  type Express,
  type RequestHandler,
} from "express";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { TaskStore } from "./store.ts";
import { createTaskSchema, updateTaskSchema } from "./tasks.ts";

export interface AppOptions {
  /** Token for admin-only routes. Defaults to TASKS_ADMIN_TOKEN. */
  adminToken?: string;
}

export type App = Express & { ready: Promise<void> };

const { version } = JSON.parse(
  readFileSync(join(import.meta.dirname, "..", "..", "package.json"), "utf8"),
) as { version: string };

const today = () => new Date().toISOString().slice(0, 10);

export function createApp(options: AppOptions = {}): App {
  const adminToken = options.adminToken ?? process.env["TASKS_ADMIN_TOKEN"];
  const store = new TaskStore();
  const ready = store.load();

  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", version });
  });

  const requireLoaded: RequestHandler = (_req, res, next) => {
    if (store.loaded) next();
    else res.status(503).json({ error: "Tasks are still loading" });
  };

  const requireAdmin: RequestHandler = (req, res, next) => {
    if (adminToken && req.get("authorization") === `Bearer ${adminToken}`)
      next();
    else res.status(401).json({ error: "Admin token required" });
  };

  app.use("/api/tasks", requireLoaded);

  app.get("/api/tasks", (_req, res) => {
    res.json(store.list());
  });

  app.get("/api/tasks/:id", (req, res) => {
    const task = store.get(req.params.id);
    if (task) res.json(task);
    else res.status(404).json({ error: "Task not found" });
  });

  app.post("/api/tasks", (req, res) => {
    const data = createTaskSchema.parse(req.body);
    res
      .status(201)
      .json(store.create({ ...data, createdAt: data.createdAt ?? today() }));
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const changes = updateTaskSchema.parse(req.body);
    const task = store.update(req.params.id, changes);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json(task);
  });

  app.delete("/api/tasks/:id", (req, res) => {
    if (store.delete(req.params.id)) res.status(204).end();
    else res.status(404).json({ error: "Task not found" });
  });

  app.delete("/api/tasks", requireAdmin, (_req, res) => {
    store.clear();
    res.status(204).end();
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid task", issues: err.issues });
      return;
    }
    const status = typeof err?.status === "number" ? err.status : 500;
    res
      .status(status)
      .json({ error: status === 500 ? "Internal error" : err.message });
  };
  app.use(onError);

  return Object.assign(app, { ready });
}
