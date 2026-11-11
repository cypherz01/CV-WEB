import { expect, test } from "@playwright/test";
import { resume } from "../../src/data/resume";
import { formatStat } from "../../src/lib/cv";

test("the hero role cycles through every role, about every 2.5 s", async ({ page }) => {
  await page.clock.install();
  await page.goto("./");
  const role = page.locator("#top [data-word-rotate]");
  await expect(role).toHaveText(resume.roles[0]);
  await page.clock.pauseAt(Date.now() + 100); // from here on, time only moves when the test says so

  /** Steps the clock 100 ms at a time until the role changes; returns the new role and the time taken. */
  async function nextChange(from: string) {
    for (let elapsed = 100; elapsed <= 4_000; elapsed += 100) {
      await page.clock.runFor(100);
      const text = await role.textContent();
      if (text !== from) return { text, elapsed };
    }
    throw new Error(`role stayed "${from}" for 4 s`);
  }

  let current = (await nextChange(resume.roles[0])).text!; // first change: unaligned, not timed
  expect(current).toBe(resume.roles[1]);
  for (const next of [...resume.roles.slice(2), resume.roles[0], resume.roles[1]]) {
    const change = await nextChange(current);
    expect(change.text).toBe(next);
    expect(change.elapsed).toBeGreaterThanOrEqual(2_300);
    expect(change.elapsed).toBeLessThanOrEqual(2_800);
    current = change.text!;
  }
});

test.describe("About stats", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // stats are well below the fold

  test("count up to their final values once scrolled into view", async ({ page }) => {
    await page.goto("./");
    const tickers = page.locator("#about [data-number-ticker]");
    await expect(tickers).toHaveCount(resume.stats.length);

    // After hydration, off-screen stats are reset to zero, ready to count.
    for (const [i, stat] of resume.stats.entries()) {
      await expect(tickers.nth(i)).toHaveText(formatStat({ ...stat, value: 0 }));
    }

    await tickers.last().scrollIntoViewIfNeeded();

    for (const [i, stat] of resume.stats.entries()) {
      await expect(tickers.nth(i)).toHaveText(formatStat(stat));
    }
  });

  test("screen readers get the final value straight away, not the count", async ({ page }) => {
    await page.goto("./");
    const terms = page.locator("#about dd");
    for (const [i, stat] of resume.stats.entries()) {
      await expect(terms.nth(i).locator('[aria-hidden="true"]')).toHaveCount(1);
      await expect(terms.nth(i).locator(".sr-only")).toHaveText(formatStat(stat));
    }
  });
});
