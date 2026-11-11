import { expect, test } from "@playwright/test";

// Swap guard: if every accent use follows --accent-brand, changing the brand colour (M6) is one CSS edit.
// The swapped-in colour is arbitrary; it only has to differ from the real accent.
const SWAPPED = "rgb(0, 128, 0)";

for (const scheme of ["light", "dark"] as const) {
  test(`links, focus rings and the primary CTA follow --accent-brand (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("./");
    await page.evaluate((c) => document.documentElement.style.setProperty("--accent-brand", c), SWAPPED);

    const link = page.locator("#contact").getByRole("link").first();
    await expect(link).toHaveCSS("color", SWAPPED);

    const cta = page.locator("#top").getByRole("link", { name: "Contact" });
    await expect(cta).toHaveCSS("background-color", SWAPPED);

    for (const focusable of [link, cta, page.getByRole("button").first()]) {
      await focusable.focus();
      await expect(focusable).toHaveCSS("outline-color", SWAPPED);
      await expect(focusable).not.toHaveCSS("outline-style", "none");
    }
  });
}
