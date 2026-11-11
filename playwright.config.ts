import { defineConfig, devices } from "@playwright/test";

// S4: the real browser, against out/ served under the GitHub Pages base path.
// Build first: `npm run build:pages` (npm run test:e2e does this for you).
const PORT = 4173;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}/CV-WEB/`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node scripts/serve-out.mjs",
    url: `http://localhost:${PORT}/CV-WEB/`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT) },
  },
});
