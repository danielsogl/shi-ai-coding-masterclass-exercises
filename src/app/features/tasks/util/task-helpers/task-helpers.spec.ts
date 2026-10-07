import {
  isOverdue,
  formatDueDate,
  getPriorityOrder,
  sortTasksByPriority,
} from "./task-helpers";
import { Task } from "../../data/models/task.model";

describe("Task Helpers", () => {
  describe("isOverdue", () => {
    it("should return true for non-completed tasks past due date", () => {
      const task: Task = {
        id: "1",
        title: "Test",
        description: "Test",
        status: "todo",
        priority: "high",
        dueDate: "2020-01-01",
        createdAt: "2020-01-01",
        order: 0,
      };
      expect(isOverdue(task)).toBe(true);
    });

    it("should return false for completed tasks", () => {
      const task: Task = {
        id: "1",
        title: "Test",
        description: "Test",
        status: "completed",
        priority: "high",
        dueDate: "2020-01-01",
        createdAt: "2020-01-01",
        order: 0,
      };
      expect(isOverdue(task)).toBe(false);
    });

    it("should return false for tasks with future due dates", () => {
      const task: Task = {
        id: "1",
        title: "Test",
        description: "Test",
        status: "todo",
        priority: "high",
        dueDate: "2099-12-31",
        createdAt: "2020-01-01",
        order: 0,
      };
      expect(isOverdue(task)).toBe(false);
    });
  });

  describe("formatDueDate", () => {
    it("should format date correctly", () => {
      const result = formatDueDate("2026-02-16");
      expect(result).toBe("Feb 16, 2026");
    });
  });

  describe("getPriorityOrder", () => {
    it("should return 0 for high priority", () => {
      expect(getPriorityOrder("high")).toBe(0);
    });

    it("should return 1 for medium priority", () => {
      expect(getPriorityOrder("medium")).toBe(1);
    });

    it("should return 2 for low priority", () => {
      expect(getPriorityOrder("low")).toBe(2);
    });
  });

  describe("sortTasksByPriority", () => {
    it("sorts a list of tasks", () => {
      const task = (id: string, priority: Task["priority"]): Task => ({
        id,
        title: "Test",
        description: "Test",
        status: "todo",
        priority,
        dueDate: "2099-12-31",
        createdAt: "2020-01-01",
        order: 0,
      });
      const sorted = sortTasksByPriority([
        task("1", "low"),
        task("2", "high"),
        task("3", "medium"),
      ]);
      expect(sorted).toBeDefined();
      expect(sorted).toHaveLength(3);
    });
  });
});
