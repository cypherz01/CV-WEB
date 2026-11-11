import { expect, test } from "@playwright/test";
import { resume } from "../../src/data/resume";

// Runs against the live site (playwright.prod.config.ts), not the local build.

test("the page is served over HTTPS with a 200", async ({ page }) => {
  const response = await page.goto("./");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).protocol).toBe("https:");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(resume.name);
});

test("every script, stylesheet and image on the page loads", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("./", { waitUntil: "networkidle" });

  expect(failed).toEqual([]);
});

test("cv.pdf is served as application/pdf", async ({ request }) => {
  const response = await request.get("cv.pdf");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^application\/pdf/);
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("the link-preview image is served as image/png", async ({ page, request }) => {
  await page.goto("./");
  const url = await page.locator('meta[property="og:image"]').getAttribute("content");
  const response = await request.get(url!);

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^image\/png/);
});
