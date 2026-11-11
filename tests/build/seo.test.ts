import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { resume } from "@/data/resume";
import { toPersonJsonLd } from "@/lib/cv";

const OUT = join(process.cwd(), "out");
const SITE = "https://cypherz01.github.io/CV-WEB/";
const html = parse(readFileSync(join(OUT, "index.html"), "utf8"));
const meta = (attr: string, value: string) =>
  html.querySelector(`meta[${attr}="${value}"]`)?.getAttribute("content");

describe("SEO", () => {
  it('has the title "Tom Cuthbertson — Software Engineer"', () => {
    expect(html.querySelector("title")?.text).toBe("Tom Cuthbertson — Software Engineer");
  });

  it("has a meta description under 160 characters", () => {
    const description = meta("name", "description");
    expect(description).toBe(resume.pitch);
    expect(description!.length).toBeLessThan(160);
  });

  it("has an absolute og:image under the base path, and the image is 1200 x 630", async () => {
    const url = meta("property", "og:image")!;
    expect(url.startsWith(SITE), url).toBe(true);
    // GitHub Pages sets Content-Type from the file extension; without ".png" it serves octet-stream.
    expect(new URL(url).pathname).toMatch(/\.png$/);

    const file = join(OUT, new URL(url).pathname.replace(/^\/CV-WEB\//, "").split("?")[0]);
    expect(existsSync(file), file).toBe(true);
    const { width, height } = await sharp(file).metadata();
    expect({ width, height }).toEqual({ width: 1200, height: 630 });
    expect(meta("property", "og:image:alt")).toBeTruthy();
  });

  it("has the canonical page URL and Open Graph basics", () => {
    expect(html.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(SITE);
    expect(meta("property", "og:url")).toBe(SITE);
    expect(meta("property", "og:title")).toBe("Tom Cuthbertson — Software Engineer");
    expect(meta("property", "og:type")).toBe("profile");
  });

  it("embeds JSON-LD equal to toPersonJsonLd(resume)", () => {
    const scripts = html.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    expect(JSON.parse(scripts[0].text)).toEqual(toPersonJsonLd(resume));
  });

  it("publishes sitemap.xml and robots.txt with the full Pages URL", () => {
    const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
    expect(sitemap).toContain(`<loc>${SITE}</loc>`);

    const robots = readFileSync(join(OUT, "robots.txt"), "utf8");
    expect(robots).toMatch(/User-Agent: \*/i);
    expect(robots).toContain(`Sitemap: ${SITE}sitemap.xml`);
  });
});
