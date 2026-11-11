import { expect, test } from "@playwright/test";

// M3 #12: the Magic UI effects take their colour from --accent-brand too (see accent.spec.ts for M2 #16).
const SWAPPED = "rgb(0, 128, 0)";

for (const scheme of ["light", "dark"] as const) {
  test(`the border beam and shimmer CTA follow --accent-brand (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("./");
    await page.evaluate((c) => document.documentElement.style.setProperty("--accent-brand", c), SWAPPED);

    const beam = page.locator("[data-border-beam] > *").first();
    await expect.poll(() => beam.evaluate((el) => getComputedStyle(el).backgroundImage)).toContain(SWAPPED);

    const shimmer = page.locator('[data-loop="shimmer"]');
    await expect(shimmer).toHaveCSS("background-color", SWAPPED);
    await expect(shimmer.locator("[data-shimmer-backdrop]")).toHaveCSS("background-color", SWAPPED);
  });
}
