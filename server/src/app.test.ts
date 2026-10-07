import { readFileSync } from "node:fs";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { join } from "node:path";
import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp, type App } from "./app.ts";
import type { Task } from "./tasks.ts";

const ADMIN_TOKEN = "test-token";

function listen(app: App): Promise<{ server: Server; base: string }> {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, base: `http://127.0.0.1:${port}/api` });
    });
  });
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

describe("Tasks API", () => {
  let server: Server;
  let base: string;

  beforeEach(async () => {
    const app = createApp({ adminToken: ADMIN_TOKEN });
    ({ server, base } = await listen(app));
    await app.ready;
  });

  afterEach(
    () => new Promise<void>((resolve) => server.close(() => resolve())),
  );

  it("health reports the version from package.json", async () => {
    const pkg = JSON.parse(
      readFileSync(
        join(import.meta.dirname, "..", "..", "package.json"),
        "utf8",
      ),
    );
    const res = await fetch(`${base}/health`);
    expect(await res.json()).toEqual({ status: "ok", version: pkg.version });
  });

  it("reports health status ok", async () => {
    const res = await fetch(`${base}/health`);
    expect(res.status).toBe(200);
    expect(((await res.json()) as { status: string }).status).toBe("ok");
  });

  it("lists the seeded tasks", async () => {
    const res = await fetch(`${base}/tasks`);
    expect(res.status).toBe(200);
    const tasks = (await res.json()) as Task[];
    expect(tasks).toHaveLength(12);
    expect(tasks[0]).toMatchObject({
      id: "1",
      title: "Set up CI pipeline",
      assignee: "ben",
    });
  });

  it("returns one task by id and 404 for an unknown id", async () => {
    expect(await (await fetch(`${base}/tasks/3`)).json()).toMatchObject({
      id: "3",
      status: "in_progress",
    });
    expect((await fetch(`${base}/tasks/nope`)).status).toBe(404);
  });

  it("creates a task with defaults", async () => {
    const res = await fetch(
      `${base}/tasks`,
      json("POST", { title: "New task", dueDate: "2026-11-01" }),
    );
    expect(res.status).toBe(201);
    const task = (await res.json()) as Task;
    expect(task).toMatchObject({
      id: "13",
      title: "New task",
      status: "todo",
      priority: "medium",
      order: 0,
    });
    expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect((await fetch(`${base}/tasks/13`)).status).toBe(200);
  });

  it("rejects an invalid task with 400", async () => {
    expect(
      (await fetch(`${base}/tasks`, json("POST", { title: "" }))).status,
    ).toBe(400);
    expect(
      (
        await fetch(
          `${base}/tasks`,
          json("POST", { title: "x", priority: "critical" }),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await fetch(
          `${base}/tasks`,
          json("POST", { title: "x", dueDate: "tomorrow" }),
        )
      ).status,
    ).toBe(400);
    expect(
      (await fetch(`${base}/tasks/1`, json("PATCH", { colour: "red" }))).status,
    ).toBe(400);
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await fetch(`${base}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });
    expect(res.status).toBe(400);
  });

  it("updates a task", async () => {
    const res = await fetch(
      `${base}/tasks/7`,
      json("PATCH", { status: "in_progress", order: 4 }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      id: "7",
      status: "in_progress",
      order: 4,
      title: "Plan Q4 roadmap",
    });
    expect(
      (await fetch(`${base}/tasks/nope`, json("PATCH", { order: 1 }))).status,
    ).toBe(404);
  });

  it("deletes a task", async () => {
    expect((await fetch(`${base}/tasks/2`, { method: "DELETE" })).status).toBe(
      204,
    );
    expect((await fetch(`${base}/tasks/2`)).status).toBe(404);
    expect((await fetch(`${base}/tasks/2`, { method: "DELETE" })).status).toBe(
      404,
    );
  });

  it("clears all tasks only with the admin token", async () => {
    expect((await fetch(`${base}/tasks`, { method: "DELETE" })).status).toBe(
      401,
    );
    const wrong = {
      method: "DELETE",
      headers: { Authorization: "Bearer wrong" },
    };
    expect((await fetch(`${base}/tasks`, wrong)).status).toBe(401);
    const admin = {
      method: "DELETE",
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    };
    expect((await fetch(`${base}/tasks`, admin)).status).toBe(204);
    expect(await (await fetch(`${base}/tasks`)).json()).toEqual([]);
  });
});

describe("Tasks API startup", () => {
  let server: Server | undefined;

  afterAll(
    () =>
      new Promise<void>((resolve) =>
        server ? server.close(() => resolve()) : resolve(),
      ),
  );

  it("serves the tasks after start", async () => {
    let base: string;
    ({ server, base } = await listen(createApp()));
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect((await fetch(`${base}/tasks`)).status).toBe(200);
  });
});
