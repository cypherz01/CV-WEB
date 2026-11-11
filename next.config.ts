import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>/. Empty for a custom domain or local `next dev`.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Inlined into the bundle so components can prefix links to files in public/ (src/lib/base-path.ts).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // GitHub Pages has no image optimiser: images in public/ are pre-sized WebP files.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
