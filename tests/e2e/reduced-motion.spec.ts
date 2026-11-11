import { expect, type Page, test } from "@playwright/test";
import { resume } from "../../src/data/resume";
import { formatStat } from "../../src/lib/cv";

const animations = (page: Page) =>
  page.evaluate(() =>
    document.getAnimations().map((a) => {
      const target = (a.effect as KeyframeEffect | null)?.target as Element | null;
      return `${a.constructor.name} on ${target?.outerHTML.slice(0, 80) ?? "?"}`;
    }),
  );

async function scrollWholePage(page: Page, onStep?: () => Promise<void>) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 300) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(30);
    await onStep?.();
  }
}

test.describe("with reduced motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("nothing animates, after load or while scrolling the whole page", async ({ page }) => {
    await page.goto("./");
    await page.waitForLoadState("networkidle");
    expect(await animations(page)).toEqual([]);

    await scrollWholePage(page, async () => expect(await animations(page)).toEqual([]));
  });

  test("the hero shows the first role and it has not changed after 5 s", async ({ page }) => {
    await page.clock.install();
    await page.goto("./");
    const role = page.locator("#top [data-word-rotate]");
    await expect(role).toHaveText(resume.roles[0]);
    // Wait for hydration, so the rotation timer (if any) is running before the clock moves.
    // (The hero CTA is paused in the server HTML and un-paused by JS once it is seen on screen.)
    await expect(page.locator('[data-loop="shimmer"]')).not.toHaveAttribute("data-paused");

    // Read once, without retrying: a retrying assertion could wait for the cycle to come back round.
    for (let elapsed = 0; elapsed < 5_000; elapsed += 500) {
      await page.clock.runFor(500);
      expect(await role.textContent()).toBe(resume.roles[0]);
    }
  });

  test("stats show their final values straight away, on and off screen", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // stats start below the fold
    await page.goto("./");
    await page.waitForLoadState("networkidle");
    const tickers = page.locator("#about [data-number-ticker]");

    for (const [i, stat] of resume.stats.entries()) {
      await expect(tickers.nth(i)).toHaveText(formatStat(stat));
    }
    await tickers.last().scrollIntoViewIfNeeded();
    for (const [i, stat] of resume.stats.entries()) {
      await expect(tickers.nth(i)).toHaveText(formatStat(stat));
    }
  });

  test("every section is visible without scrolling to it", async ({ page }) => {
    await page.goto("./");
    await page.waitForLoadState("networkidle");
    const sections = page.locator("[data-blur-fade]");
    expect(await sections.count()).toBeGreaterThan(0);

    for (const section of await sections.all()) {
      await expect(section).not.toHaveAttribute("data-blur-fade", "hidden");
      expect(await section.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    }
  });

  test("scrolling to an anchor jumps instead of animating", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  });
});

test("with motion allowed, in-page links scroll smoothly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
});
