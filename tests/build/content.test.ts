import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";
import { resume } from "@/data/resume";
import { formatStat } from "@/lib/cv";

// Text as a reader with JavaScript turned off gets it: the raw HTML, entities decoded, whitespace collapsed.
const html = parse(readFileSync(join(process.cwd(), "out", "index.html"), "utf8"));
const pageText = html.querySelector("body")!.text.replace(/\s+/g, " ");

describe("content without JavaScript", () => {
  const pieces: [string, string[]][] = [
    ["hero", [resume.name, resume.roles[0], resume.location, resume.pitch]],
    ["about", [resume.about, ...resume.stats.flatMap((s) => [s.label, formatStat(s)])]],
    ["experience", resume.work.flatMap((r) => [r.title, r.company, ...r.highlights, ...(r.tech ?? [])])],
    ["skills", Object.entries(resume.skills).flat(2)],
    ["projects", resume.projects.flatMap((p) => [p.name, p.summary, ...p.tech])],
    ["education", resume.education.flatMap((e) => [e.qualification, e.institution])],
    ["contact", [resume.contact.email, resume.availability]],
  ];

  for (const [section, texts] of pieces) {
    it(`has all of the ${section} text in out/index.html`, () => {
      for (const text of texts) {
        expect(pageText, text).toContain(text.replace(/\s+/g, " "));
      }
    });
  }

  it("ships the experience bullets in the HTML, collapsed with `hidden`", () => {
    const items = html.querySelectorAll("#work li");
    for (const highlight of resume.work.flatMap((r) => r.highlights)) {
      const li = items.find((el) => el.text.trim() === highlight);
      expect(li, highlight).toBeDefined();
      expect(li!.parentNode?.hasAttribute("hidden"), highlight).toBe(true);
    }
  });
});
