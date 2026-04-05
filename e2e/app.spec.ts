import { expect, test } from "@playwright/test";

test("landing page loads and navigates into the studio", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /A polished RevenueCat analytics workspace built to demo, ship, and explain\./i,
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: /open dashboard/i }).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Recurring revenue, retention, and growth context in one premium command surface\./i,
    }),
  ).toBeVisible();
});

test("dashboard shows KPI cards in demo mode", async ({ page }) => {
  await page.goto("/studio/dashboard");
  await expect(page.getByTestId("demo-mode-banner")).toBeVisible();
  await expect(page.getByTestId("kpi-mrr")).toBeVisible();
});

test("developer console generates snippets", async ({ page }) => {
  await page.goto("/studio/console");
  await expect(
    page.getByRole("heading", { level: 1, name: /API explorer built for fast demos/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: /TypeScript snippet/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: /curl snippet/i }),
  ).toBeVisible();
});

test("insight flow works in demo mode", async ({ page }) => {
  await page.goto("/studio/insights");
  await page.getByRole("button", { name: /generate insight/i }).click();
  await expect(page.getByTestId("insight-title")).toBeVisible();
});
