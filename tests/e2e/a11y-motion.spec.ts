import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// M4 #9: axe across both themes and both motion settings, with everything on the page revealed
// (faded sections scrolled into view, accordions open), so nothing is skipped as "hidden".
for (const scheme of ["light", "dark"] as const) {
  for (const motion of ["reduce", "no-preference"] as const) {
    test(`axe finds no violations: ${scheme} theme, reduced motion ${motion}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: motion });
      await page.goto("./");
      await expect(page.locator('[data-loop="shimmer"]')).not.toHaveAttribute("data-paused"); // hydrated

      // Reveal everything: scroll through (BlurFade), then open every accordion.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= height; y += 300) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
        await page.waitForTimeout(30);
      }
      for (const toggle of await page.locator("#work button[aria-expanded]").all()) await toggle.click();
      await expect(page.locator('[data-blur-fade="hidden"]')).toHaveCount(0);
      await page.waitForTimeout(500); // let the last fade-ins finish

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    });
  }
}
