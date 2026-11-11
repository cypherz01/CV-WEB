import { expect, test } from "@playwright/test";

test("home page loads under the GitHub Pages base path", async ({ page }) => {
  const response = await page.goto("./");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("main")).toBeVisible();
});
