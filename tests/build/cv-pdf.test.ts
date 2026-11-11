import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const OUT = join(process.cwd(), "out");

describe("cv.pdf", () => {
  it("is generated into out/ from the site's print styles", () => {
    const file = join(OUT, "cv.pdf");
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file).subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("is at most 2 A4 pages", () => {
    const pdf = readFileSync(join(OUT, "cv.pdf")).toString("latin1");
    const pages = pdf.match(/\/Type\s*\/Page\b/g) ?? [];
    expect(pages.length).toBeGreaterThan(0);
    expect(pages.length).toBeLessThanOrEqual(2);

    // A4 is 595 x 842 points.
    const box = /\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/.exec(pdf);
    expect(box && [Math.round(Number(box[1])), Math.round(Number(box[2]))]).toEqual([595, 842]);
  });

  it("is what the Download CV link points to, under the base path", () => {
    const html = parse(readFileSync(join(OUT, "index.html"), "utf8"));
    const link = html.querySelectorAll("#top a").find((a) => a.text.includes("Download CV"));
    expect(link?.getAttribute("href")).toBe("/CV-WEB/cv.pdf");
  });
});
