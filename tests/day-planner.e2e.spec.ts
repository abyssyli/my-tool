import { expect, test } from "@playwright/test";

test("build -> start -> verify core flows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Day Planner")).toBeVisible();

  const today = await page.evaluate(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });
  await expect(page.getByText(/Today ·/)).toBeVisible();

  await page.goto("/week");
  await expect(page.getByText("7-day overview")).toBeVisible();
  await expect(page.getByText("Total tasks")).toBeVisible();

  const firstDayCard = page.locator('main a[href^="/day/"]').first();
  await expect(firstDayCard).toContainText("Today");
  await expect(firstDayCard).toContainText("Work");
  await expect(firstDayCard).toContainText("Life");

  await page.goto("/templates");
  await expect(page.getByText("Workday template")).toBeVisible();
  await expect(page.getByText("Studyday template")).toBeVisible();
  await expect(page.getByText("Gymday template")).toBeVisible();

  await page.goto(`/day/${today}`);
  await expect(page.locator("main").getByText("Tasks", { exact: true })).toBeVisible();
});
