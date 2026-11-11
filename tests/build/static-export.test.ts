import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const OUT = join(process.cwd(), "out");
const readOut = (file: string) => readFileSync(join(OUT, file), "utf8");

describe("static export", () => {
  it("builds the home page to out/index.html in English", () => {
    expect(existsSync(join(OUT, "index.html"))).toBe(true);

    const html = parse(readOut("index.html"));
    expect(html.querySelector("html")?.getAttribute("lang")).toBe("en");
  });

  it("serves every script and stylesheet from under the GitHub Pages base path", () => {
    const html = parse(readOut("index.html"));
    const assetUrls = [
      ...html.querySelectorAll("script[src]").map((el) => el.getAttribute("src")!),
      ...html.querySelectorAll('link[rel="stylesheet"]').map((el) => el.getAttribute("href")!),
    ];

    expect(assetUrls.length).toBeGreaterThan(0);
    for (const url of assetUrls) {
      expect(url).toMatch(/^\/CV-WEB\//);
    }
  });

  it("self-hosts its fonts instead of loading them from Google", () => {
    const page = readOut("index.html");
    expect(page).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);

    const fontFiles = readdirSync(OUT, { recursive: true, encoding: "utf8" }).filter((f) =>
      f.endsWith(".woff2"),
    );
    expect(fontFiles.length).toBeGreaterThanOrEqual(2); // Geist Sans + Geist Mono
  });

  it("includes .nojekyll so GitHub Pages serves the _next/ folder", () => {
    expect(existsSync(join(OUT, ".nojekyll"))).toBe(true);
  });
});
