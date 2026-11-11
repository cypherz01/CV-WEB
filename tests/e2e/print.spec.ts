import { expect, test } from "@playwright/test";
import { resume } from "../../src/data/resume";

test.describe("print", () => {
  test.beforeEach(async ({ page }) => {
    // Dark system theme on purpose: print must force the light theme anyway.
    await page.emulateMedia({ media: "print", colorScheme: "dark" });
    await page.goto("./");
  });

  test("fits on at most 2 A4 pages", async ({ page }) => {
    const pdf = (await page.pdf({ format: "A4", printBackground: true })).toString("latin1");
    const pages = pdf.match(/\/Type\s*\/Page\b/g) ?? [];

    expect(pages.length).toBeGreaterThan(0);
    expect(pages.length).toBeLessThanOrEqual(2);
  });

  test("hides buttons and button-styled links", async ({ page }) => {
    for (const el of await page.locator('button, [data-slot="button"]').all()) {
      await expect(el).toBeHidden();
    }
  });

  test("shows every experience bullet", async ({ page }) => {
    for (const highlight of resume.work.flatMap((r) => r.highlights)) {
      await expect(page.getByText(highlight, { exact: true })).toBeVisible();
    }
  });

  test("prints each link's URL after its text, so it can be read on paper", async ({ page }) => {
    const links = page.locator('main a[href^="http"], main a[href^="mailto:"]');
    expect(await links.count()).toBeGreaterThan(0);

    for (const link of await links.all()) {
      const { href, printed } = await link.evaluate((a) => ({
        href: a.getAttribute("href")!,
        printed: (a as HTMLElement).innerText + getComputedStyle(a, "::after").content,
      }));
      // A mailto link that already shows its address needs nothing added.
      expect(printed, href).toContain(href.replace(/^mailto:/, ""));
    }
  });

  test("forces the light theme", async ({ page }) => {
    await expect(page.locator("html")).toHaveClass(/\bdark\b/); // the screen theme is still dark...
    const colours = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return { bg: s.backgroundColor, fg: s.color };
    });
    expect(colours).toEqual({ bg: "rgb(255, 255, 255)", fg: "rgb(9, 9, 11)" }); // ...but print is light
  });
});
