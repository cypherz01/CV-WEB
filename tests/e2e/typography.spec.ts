import { expect, test } from "@playwright/test";

test("the page and body text are set in Geist Sans", async ({ page }) => {
  await page.goto("./");

  const fonts = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).fontFamily,
    body: getComputedStyle(document.body).fontFamily,
  }));

  expect(fonts.html).toMatch(/^"?Geist"?,/);
  expect(fonts.body).toMatch(/^"?Geist"?,/);
});
