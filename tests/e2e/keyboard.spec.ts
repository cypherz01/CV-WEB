import { expect, test } from "@playwright/test";

// The planned order. Each group is a CSS selector, in document order within the group.
const TAB_ORDER = [
  'a[href="#main"]', // skip link
  "#top a", // hero CTAs
  "#work button", // experience accordions
  "#projects a", // project links
  "#contact a", // email and profiles
  'nav[aria-label="Dock"] a, nav[aria-label="Dock"] button', // dock icons
];

for (const scheme of ["light", "dark"] as const) {
  test(`Tab visits every control in the planned order, each with a visible focus ring (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await page.goto("./");

    const expected = await page.evaluate((groups) => {
      const els = groups.flatMap((sel) => [...document.querySelectorAll<HTMLElement>(sel)]);
      els.forEach((el, i) => (el.dataset.tabExpect = String(i)));
      return els.map((el) => el.getAttribute("aria-label") ?? el.innerText.trim().replace(/\s+/g, " "));
    }, TAB_ORDER);
    expect(expected.length).toBeGreaterThan(10);

    for (const [i, name] of expected.entries()) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const style = getComputedStyle(el);
        return {
          index: el.dataset.tabExpect ?? `unexpected: ${el.outerHTML.slice(0, 100)}`,
          outline: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2,
        };
      });
      expect(focused.index, `Tab #${i + 1} should reach "${name}"`).toBe(String(i));
      expect(focused.outline, `"${name}" shows a focus ring`).toBe(true);
    }
  });
}
