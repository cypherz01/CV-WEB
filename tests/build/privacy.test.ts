import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const OUT = join(process.cwd(), "out");
const TEXT_FILES = [".html", ".js", ".css", ".txt", ".json", ".xml", ".svg", ".webmanifest"];
const builtTextFiles = readdirSync(OUT, { recursive: true, encoding: "utf8" })
  .filter((f) => TEXT_FILES.includes(extname(f)))
  .map((f) => ({ file: f, text: readFileSync(join(OUT, f), "utf8") }));

const TRACKERS = [
  "googletagmanager",
  "google-analytics",
  "gtag(",
  "plausible.io",
  "va.vercel-scripts",
  "/_vercel/insights",
  "cdn.segment",
  "hotjar",
  "clarity.ms",
  "umami",
];

describe("privacy", () => {
  it("loads every script, stylesheet and font from the site itself", () => {
    const html = parse(readFileSync(join(OUT, "index.html"), "utf8"));
    const urls = [
      ...html.querySelectorAll("script[src]").map((el) => el.getAttribute("src")!),
      ...html.querySelectorAll("link[href]")
        .filter((el) => !["canonical"].includes(el.getAttribute("rel") ?? ""))
        .map((el) => el.getAttribute("href")!),
    ];
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(url, url).toMatch(/^\/CV-WEB\//);
  });

  it("contains no analytics or tracking code in any built file", () => {
    for (const { file, text } of builtTextFiles) {
      for (const tracker of TRACKERS) expect(text.includes(tracker), `${tracker} in ${file}`).toBe(false);
    }
  });

  it("has no phone number in any built file", () => {
    // UK numbers: +44 forms, mobiles, and landlines written with a space or dash.
    const PHONE =
      /\+44[\s-]?(\(0\)[\s-]?)?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}|\b07\d{3}[\s-]?\d{3}[\s-]?\d{3}\b|\b0[1-9]\d{1,3}[\s-]\d{3,4}[\s-]?\d{3,4}\b/;
    for (const sample of ["+44 7700 900123", "07700 900123", "07700900123", "028 9012 3456", "+44 (0)28 9012 3456"]) {
      expect(PHONE.test(sample), `pattern catches ${sample}`).toBe(true);
    }
    expect(builtTextFiles.length).toBeGreaterThan(5);
    for (const { file, text } of builtTextFiles) {
      expect(text.match(PHONE)?.[0], file).toBeUndefined();
      // React DOM mentions "tel:" itself, so only a link to one counts.
      expect(/href=["']?tel:/i.test(text), `tel: link in ${file}`).toBe(false);
    }
  });
});
