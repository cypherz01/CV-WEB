// Builds the static export exactly as GitHub Pages serves it: under /CV-WEB/.
// Usage: node scripts/build-pages.mjs   (override with BASE_PATH=... for a custom domain)
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const PAGES_BASE_PATH = "/CV-WEB";

export function buildPages() {
  const result = spawnSync("npx next build", {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, BASE_PATH: process.env.BASE_PATH ?? PAGES_BASE_PATH },
  });
  if (result.status !== 0) {
    throw new Error(`next build failed with exit code ${result.status}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildPages();
}
