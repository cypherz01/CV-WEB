import { defineConfig, devices } from "@playwright/test";

// M5 smoke tests: the live site, after a deploy. Run with `npm run test:smoke`.
// PROD_URL overrides the address (e.g. once a custom domain is set up).
export default defineConfig({
  testDir: "./tests/smoke",
  retries: 2, // Pages' CDN can take a moment to serve a fresh deploy
  reporter: process.env.CI ? "github" : "list",
  timeout: 120_000,
  use: {
    baseURL: process.env.PROD_URL ?? "https://cypherz01.github.io/CV-WEB/",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
