import { expect, test } from "@playwright/test";

test.describe("theme follows the system setting", () => {
  test("dark system preference renders the dark theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("./");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("light system preference renders the light theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("./");

    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });
});
