import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("I open the task board", async ({ page }) => {
  await page.goto("/");
});

When("I create a task titled {string}", async ({ page }, title: string) => {
  await page.getByRole("button", { name: "Create new task" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Title").fill(title);
  await dialog.getByLabel("Description").fill("Created by E2E");
  await dialog.getByLabel("Due Date").fill("12/31/2099");
  await dialog.getByRole("button", { name: "Create" }).click();
  await expect(dialog).toBeHidden();
});

Then("I see the task {string}", async ({ page }, title: string) => {
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});
