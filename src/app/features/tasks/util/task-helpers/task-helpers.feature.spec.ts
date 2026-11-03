import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { Task, TaskPriority, TaskStatus } from "../../data/models/task.model";
import { isOverdue, sortTasksByPriority } from "./task-helpers";

const feature = await loadFeature(
  "src/app/features/tasks/util/task-helpers/task-helpers.feature",
);

const task = (overrides: Partial<Task>): Task => ({
  id: "1",
  title: "Test",
  description: "",
  status: "todo",
  priority: "medium",
  createdAt: "2020-01-01",
  order: 0,
  ...overrides,
});

const list = (csv: string) => csv.split(",").map((s) => s.trim());

describeFeature(feature, ({ Scenario }) => {
  Scenario("Tasks are sorted by priority", ({ Given, When, Then }) => {
    let tasks: Task[] = [];
    Given("tasks with the priorities {string}", (_, priorities: string) => {
      tasks = list(priorities).map((p, i) =>
        task({ id: String(i), priority: p as TaskPriority }),
      );
    });
    When("I sort the tasks by priority", () => {
      tasks = sortTasksByPriority(tasks);
    });
    Then("the priorities are in the order {string}", (_, order: string) => {
      expect(tasks.map((t) => t.priority)).toEqual(list(order));
    });
  });

  Scenario("A completed task is never overdue", ({ Given, Then }) => {
    let subject: Task;
    Given(
      "a {string} task due on {string}",
      (_, status: string, dueDate: string) => {
        subject = task({ status: status as TaskStatus, dueDate });
      },
    );
    Then("the task is not overdue", () => {
      expect(isOverdue(subject)).toBe(false);
    });
  });
});
