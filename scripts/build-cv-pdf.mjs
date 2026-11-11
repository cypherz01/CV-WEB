// Prints the built site to out/cv.pdf with the site's own print styles, so the PDF can never
// drift from resume.ts. Runs after `next build` (see build-pages.mjs). Needs Playwright's Chromium:
// `npx playwright install chromium`.
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { serveOut } from "./serve-out.mjs";

export async function buildCvPdf({ base = process.env.BASE_PATH ?? "/CV-WEB" } = {}) {
  const { server, url } = await serveOut({ port: 0, base });
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    // Reduced motion: every section is visible and every number final, with nothing mid-animation.
    await page.emulateMedia({ media: "print", colorScheme: "light", reducedMotion: "reduce" });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const path = join(process.cwd(), "out", "cv.pdf");
    await page.pdf({ path, format: "A4", printBackground: true, preferCSSPageSize: true });
    return path;
  } finally {
    await browser.close();
    server.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`Wrote ${await buildCvPdf()}`);
}
