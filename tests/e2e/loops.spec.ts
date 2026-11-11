import { expect, type Page, test } from "@playwright/test";

/** Infinitely repeating animations that are actually running (not paused or finished). */
const runningLoops = (page: Page) =>
  page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations === Infinity)
      .map((a) => (a.effect as KeyframeEffect).target?.closest("[data-loop]")?.getAttribute("data-loop") ?? "unknown"),
  );

for (const viewport of [
  { width: 375, height: 667 },
  { width: 1280, height: 720 },
]) {
  test(`at most one infinite animation runs at a time, all the way down (${viewport.width} px)`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("./");
    await expect(page.locator("#about [data-blur-fade]")).toHaveAttribute("data-blur-fade", "shown"); // hydrated

    const seen = new Set<string>();
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 150) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(50); // let IntersectionObserver callbacks run
      const loops = await runningLoops(page);
      expect(loops.length, `at scrollY ${y}: ${loops.join(", ")}`).toBeLessThanOrEqual(1);
      loops.forEach((l) => seen.add(l));
    }

    // The effects do run when they are on screen.
    expect([...seen].sort()).toEqual(["border-beam", "shimmer"]);
  });
}
