import { z } from "zod";

export const taskStatus = z.enum(["todo", "in_progress", "completed"]);
export const taskPriority = z.enum(["low", "medium", "high"]);

export const taskSchema = z.strictObject({
  id: z.string(),
  title: z.string().trim().min(1).max(100),
  description: z.string().max(500),
  status: taskStatus,
  priority: taskPriority,
  dueDate: z.iso.date().optional(),
  createdAt: z.iso.date(),
  completedAt: z.iso.date().optional(),
  order: z.number().int().min(0),
  assignee: z.string().min(1).optional(),
});

export type Task = z.infer<typeof taskSchema>;

export const createTaskSchema = taskSchema.omit({ id: true }).extend({
  description: taskSchema.shape.description.default(""),
  status: taskStatus.default("todo"),
  priority: taskPriority.default("medium"),
  createdAt: z.iso.date().optional(),
  order: taskSchema.shape.order.default(0),
});

export const updateTaskSchema = taskSchema.omit({ id: true }).partial();
