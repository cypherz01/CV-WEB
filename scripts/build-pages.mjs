// Builds the static export exactly as GitHub Pages serves it: under /CV-WEB/, then prints out/cv.pdf.
// Usage: node scripts/build-pages.mjs   (override with BASE_PATH=... for a custom domain)
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { buildCvPdf } from "./build-cv-pdf.mjs";

export const PAGES_BASE_PATH = "/CV-WEB";

export async function buildPages() {
  const basePath = process.env.BASE_PATH ?? PAGES_BASE_PATH;
  const result = spawnSync("npx next build", {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, BASE_PATH: basePath },
  });
  if (result.status !== 0) {
    throw new Error(`next build failed with exit code ${result.status}`);
  }
  console.log(`Wrote ${await buildCvPdf({ base: basePath })}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await buildPages();
}
