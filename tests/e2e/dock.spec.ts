import { expect, test } from "@playwright/test";

const SECTION_LINKS = [
  ["Home", "top"],
  ["About", "about"],
  ["Experience", "work"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Contact", "contact"],
] as const;

const dock = (page: import("@playwright/test").Page) => page.getByRole("navigation", { name: "Dock" });

test.describe("Dock", () => {
  test("sits fixed at the bottom centre of the screen", async ({ page }) => {
    await page.goto("./");
    const nav = dock(page);
    await expect(nav).toHaveCSS("position", "fixed");

    const box = (await nav.boundingBox())!;
    const { width, height } = page.viewportSize()!;
    expect(box.x + box.width / 2).toBeCloseTo(width / 2, 0);
    expect(height - (box.y + box.height)).toBeGreaterThanOrEqual(0);
    expect(height - (box.y + box.height)).toBeLessThanOrEqual(32);

    await page.mouse.wheel(0, 3000); // still there after scrolling
    await expect.poll(async () => (await nav.boundingBox())!.y).toBeCloseTo(box.y, 0);
  });

  test("every icon has an accessible name and a matching tooltip", async ({ page }) => {
    await page.goto("./");
    const items = dock(page).locator("a, button");
    expect(await items.count()).toBeGreaterThanOrEqual(SECTION_LINKS.length);

    for (const item of await items.all()) {
      const name = (await item.getAttribute("aria-label")) ?? "";
      expect(name.trim(), await item.evaluate((el) => el.outerHTML.slice(0, 80))).not.toBe("");

      await item.hover();
      await expect(page.getByRole("tooltip")).toHaveText(name);
      // In steps, like a real mouse: Radix closes the tooltip on the pointer move *after* leaving.
      await page.mouse.move(0, 0, { steps: 5 });
      await expect(page.getByRole("tooltip")).toHaveCount(0);
    }
  });

  for (const [label, id] of SECTION_LINKS.slice(1)) {
    test(`the ${label} icon scrolls to #${id} under the base path`, async ({ page }) => {
      await page.goto("./");
      await dock(page).getByRole("link", { name: label, exact: true }).click();

      await expect(page).toHaveURL(new RegExp(`/CV-WEB/#${id}$`));
      // The section is at the top of the screen, or the page is scrolled as far as it goes (the last section).
      await expect
        .poll(() =>
          page.locator(`#${id}`).evaluate((el) => {
            const atBottom = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight;
            return el.getBoundingClientRect().top <= 40 || atBottom;
          }),
        )
        .toBe(true);
    });
  }
});

test.describe("Dock on a 375 px touch screen", () => {
  test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

  test("fits the screen with tap targets of at least 40 x 40 px", async ({ page }) => {
    await page.goto("./");
    const nav = (await dock(page).boundingBox())!;
    expect(nav.x).toBeGreaterThanOrEqual(0);
    expect(nav.x + nav.width).toBeLessThanOrEqual(375);

    for (const item of await dock(page).locator("a, button").all()) {
      const box = (await item.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(40);
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });

  test("does not magnify icons on touch", async ({ page }) => {
    await page.goto("./");
    const icon = dock(page).getByRole("link", { name: "About" });
    const before = (await icon.boundingBox())!;

    // A tap reports a mouse position; put it dead centre on the icon.
    await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2, { steps: 5 });
    await page.waitForTimeout(400);
    expect((await icon.boundingBox())!.width).toBeCloseTo(before.width, 0);
  });
});

test("Dock icons magnify under a mouse pointer", async ({ page }) => {
  await page.goto("./");
  const icon = dock(page).getByRole("link", { name: "About" });
  const before = (await icon.boundingBox())!.width;

  await icon.hover();
  await expect.poll(async () => (await icon.boundingBox())!.width).toBeGreaterThan(before + 5);
});

test.describe("theme toggle", () => {
  test("switches html.dark and remembers the choice after a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("./");
    const html = page.locator("html");
    const toggle = dock(page).getByRole("button", { name: /theme/i });
    await expect(html).not.toHaveClass(/\bdark\b/);

    await toggle.click();
    await expect(html).toHaveClass(/\bdark\b/);
    await page.reload();
    await expect(html).toHaveClass(/\bdark\b/);

    await dock(page).getByRole("button", { name: /theme/i }).click();
    await expect(html).not.toHaveClass(/\bdark\b/);
    await page.reload();
    await expect(html).not.toHaveClass(/\bdark\b/);
  });
});

test("the scroll progress bar grows as the page scrolls", async ({ page }) => {
  await page.goto("./");
  const bar = page.locator("[data-scroll-progress]");
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  const width = () => bar.evaluate((el) => el.getBoundingClientRect().width);
  const viewport = page.viewportSize()!.width;

  expect(await width()).toBeLessThan(viewport * 0.05);

  await page.evaluate(() => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
  await expect.poll(width).toBeGreaterThan(viewport * 0.4);
  expect(await width()).toBeLessThan(viewport * 0.6);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(width).toBeGreaterThan(viewport * 0.98);
});
