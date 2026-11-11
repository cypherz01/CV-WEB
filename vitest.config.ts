import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": src } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit", // S1 content module + S2 rendered sections
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["./tests/setup-dom.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "build", // S3 static build output
          environment: "node",
          include: ["tests/build/**/*.test.ts"],
          globalSetup: ["./tests/build/global-setup.ts"],
          testTimeout: 30_000,
        },
      },
    ],
  },
});
