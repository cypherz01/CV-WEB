import { expect, test } from "@playwright/test";

// BlurFade: sections below the fold fade in once 20% of them is on screen.
test.use({ viewport: { width: 1280, height: 720 } });

const opacity = (el: Element) => getComputedStyle(el).opacity;

test("a section below the fold starts hidden and appears once 20% of it is on screen", async ({ page }) => {
  await page.goto("./");
  const projects = page.locator("#projects [data-blur-fade]");

  await expect(projects).toHaveAttribute("data-blur-fade", "hidden"); // set after hydration
  expect(await projects.evaluate(opacity)).toBe("0");

  // Bring the top 25% of the section on screen.
  await projects.evaluate((el) => {
    const { top, height } = el.getBoundingClientRect();
    window.scrollBy(0, top - innerHeight + height * 0.25);
  });

  await expect(projects).toHaveAttribute("data-blur-fade", "shown");
  await expect.poll(() => projects.evaluate(opacity)).toBe("1");
});

test("stays shown after scrolling away again (it only animates once)", async ({ page }) => {
  await page.goto("./");
  const projects = page.locator("#projects [data-blur-fade]");
  await expect(projects).toHaveAttribute("data-blur-fade", "hidden");

  await projects.scrollIntoViewIfNeeded();
  await expect(projects).toHaveAttribute("data-blur-fade", "shown");
  await page.evaluate(() => window.scrollTo(0, 0));

  await expect(projects).toHaveAttribute("data-blur-fade", "shown");
});

test("a section already on screen at load is never hidden", async ({ page }) => {
  await page.goto("./");
  const about = page.locator("#about [data-blur-fade]");

  await expect(about).toHaveAttribute("data-blur-fade", "shown");
  expect(await about.evaluate(opacity)).toBe("1");
});
