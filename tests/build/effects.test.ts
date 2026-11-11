import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";
import { resume } from "@/data/resume";

const html = parse(readFileSync(join(process.cwd(), "out", "index.html"), "utf8"));

describe("effects before hydration", () => {
  it("wraps the sections below the hero in BlurFade", () => {
    for (const id of ["about", "work", "skills", "projects", "education", "contact"]) {
      expect(html.querySelector(`#${id} [data-blur-fade]`), `#${id}`).not.toBeNull();
    }
  });

  it("keeps faded sections' text in the HTML and never hides it in the server markup", () => {
    const projects = html.querySelector("#projects [data-blur-fade]")!;
    expect(projects.text).toContain(resume.projects[0].summary);

    // Nothing in the server HTML is hidden by an inline style or a data-state that CSS hides.
    expect(html.querySelectorAll("[data-blur-fade]").every((el) => el.getAttribute("data-blur-fade") !== "hidden")).toBe(true);
    for (const el of html.querySelectorAll("[style]")) {
      expect(el.getAttribute("style"), el.outerHTML.slice(0, 120)).not.toMatch(/opacity:\s*0(?![.\d])/);
    }
  });
});
