import { expect, type Locator, type Page, test } from "@playwright/test";
import { resume } from "../../src/data/resume";

async function box(locator: Locator) {
  const b = await locator.boundingBox();
  expect(b, "element is rendered").not.toBeNull();
  return b!;
}

test.describe("phone, 375 px", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("name, role and the Contact CTA are all on the first screen", async ({ page }) => {
    await page.goto("./");

    const firstScreen = [
      page.getByRole("heading", { level: 1 }),
      page.locator("#top").getByText(resume.roles[0], { exact: true }),
      page.locator("#top").getByRole("link", { name: "Contact" }),
    ];
    for (const el of firstScreen) {
      await expect(el).toBeVisible();
      const { y, height } = await box(el);
      expect(y + height).toBeLessThanOrEqual(667);
    }
  });
});

/** Card boxes in the projects grid, rounded to whole pixels. */
async function cardBoxes(page: Page) {
  const cards = page.locator("#projects article");
  return Promise.all((await cards.all()).map(box));
}

/** Pads the grid out to `count` projects by cloning the last (non-featured) card. */
async function padProjects(page: Page, count: number) {
  await page.locator("#projects article").last().evaluate((card, n) => {
    const grid = card.parentElement!;
    while (grid.children.length < n) grid.append(card.cloneNode(true));
  }, count);
}

for (const projectCount of [resume.projects.length, 5]) {
  test.describe(`projects grid with ${projectCount} projects`, () => {
    test("is a single column below 768 px", async ({ page }) => {
      await page.setViewportSize({ width: 767, height: 900 });
      await page.goto("./");
      await padProjects(page, projectCount);

      const boxes = await cardBoxes(page);
      expect(boxes).toHaveLength(projectCount);
      for (const b of boxes) expect(b.x).toBeCloseTo(boxes[0].x, 0);
      for (const b of boxes) expect(b.width).toBeCloseTo(boxes[0].width, 0);
    });

    test("at 1024 px the featured card spans the row and the rest sit 2 per row", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 900 });
      await page.goto("./");
      await padProjects(page, projectCount);

      const grid = await box(page.getByTestId("projects-grid"));
      const [featured, ...others] = await cardBoxes(page);
      await expect(page.locator("#projects article").first()).toHaveAttribute("data-featured", "true");
      expect(featured.width).toBeCloseTo(grid.width, 0);

      for (let i = 0; i < others.length; i++) {
        const b = others[i];
        expect(b.width).toBeLessThan(grid.width / 2);
        const column = i % 2;
        expect(b.x, `card ${i + 2} column`).toBeCloseTo(column === 0 ? grid.x : grid.x + grid.width - b.width, 0);
        if (column === 1) expect(b.y, `card ${i + 2} shares a row`).toBeCloseTo(others[i - 1].y, 0);
      }
    });
  });
}
