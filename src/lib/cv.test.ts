import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { formatDateRange, formatStat, sortRolesNewestFirst, toPersonJsonLd, validateResume } from "./cv";

describe("formatDateRange", () => {
  it("shows an ongoing month-precise role as running to Present", () => {
    expect(formatDateRange({ start: "2024-09" })).toBe("Sept 2024 – Present");
  });

  it("shows a finished month-precise role with both months", () => {
    expect(formatDateRange({ start: "2023-04", end: "2024-01" })).toBe("Apr 2023 – Jan 2024");
  });

  it("shows year-only dates as years", () => {
    expect(formatDateRange({ start: "2021", end: "2022" })).toBe("2021 – 2022");
  });
});

describe("sortRolesNewestFirst", () => {
  const role = (company: string, start: string, end?: string) => ({ company, start, end });

  it("puts the most recently started role first", () => {
    const sorted = sortRolesNewestFirst([
      role("Older", "2019", "2021"),
      role("Newest", "2024-09"),
      role("Middle", "2022", "2024"),
    ]);
    expect(sorted.map((r) => r.company)).toEqual(["Newest", "Middle", "Older"]);
  });

  it("treats a year-only start as earlier than a month in the same year", () => {
    const sorted = sortRolesNewestFirst([role("Year only", "2024"), role("September", "2024-09")]);
    expect(sorted.map((r) => r.company)).toEqual(["September", "Year only"]);
  });

  it("puts an ongoing role above a finished one with the same start", () => {
    const sorted = sortRolesNewestFirst([role("Finished", "2022", "2023"), role("Ongoing", "2022")]);
    expect(sorted.map((r) => r.company)).toEqual(["Ongoing", "Finished"]);
  });

  it("does not reorder the array it was given", () => {
    const roles = [role("A", "2020"), role("B", "2023")];
    sortRolesNewestFirst(roles);
    expect(roles.map((r) => r.company)).toEqual(["A", "B"]);
  });
});

describe("validateResume", () => {
  it("accepts a valid CV", () => {
    expect(validateResume(fixture())).toEqual([]);
  });

  it.each(["2024-13", "24-09", "2024/09", "Sept 2024", ""])("rejects the role start date %j", (start) => {
    const cv = fixture();
    cv.work[0].start = start;
    expect(validateResume(cv)).toContainEqual(expect.stringContaining("work[0].start"));
  });

  it("rejects a malformed end date and education year", () => {
    const cv = fixture();
    cv.work[1].end = "2023-1";
    cv.education[0].end = "16";
    const errors = validateResume(cv);
    expect(errors).toContainEqual(expect.stringContaining("work[1].end"));
    expect(errors).toContainEqual(expect.stringContaining("education[0].end"));
  });
});

describe("validateResume: highlights", () => {
  it.each([
    [1, false],
    [2, true],
    [4, true],
    [5, false],
  ])("a role with %i highlights is valid: %s", (count, valid) => {
    const cv = fixture();
    cv.work[0].highlights = Array.from({ length: count }, (_, n) => `Achievement ${n + 1}.`);
    const errors = validateResume(cv).filter((e) => e.startsWith("work[0].highlights"));
    expect(errors.length === 0).toBe(valid);
  });
});

describe("validateResume: project summaries", () => {
  it.each([
    [140, true],
    [141, false],
  ])("a %i-character summary is valid: %s", (length, valid) => {
    const cv = fixture();
    cv.projects[1].summary = "x".repeat(length);
    const errors = validateResume(cv).filter((e) => e.startsWith("projects[1].summary"));
    expect(errors.length === 0).toBe(valid);
  });
});

describe("validateResume: projects", () => {
  it("rejects more than one featured project", () => {
    const cv = fixture();
    cv.projects[1].featured = true;
    expect(validateResume(cv)).toContainEqual(expect.stringContaining("projects: 2 featured"));
  });

  it.each([
    [0, false],
    [1, true],
    [6, true],
    [7, false],
  ])("%i projects is valid: %s", (count, valid) => {
    const cv = fixture();
    cv.projects = Array.from({ length: count }, (_, n) => ({
      name: `Project ${n}`,
      summary: "Short summary.",
      tech: ["Go"],
    }));
    const errors = validateResume(cv).filter((e) => e.startsWith("projects:"));
    expect(errors.length === 0).toBe(valid);
  });
});

describe("formatStat", () => {
  it.each([
    [{ label: "Funding", value: 85, prefix: "£", suffix: "k" }, "£85k"],
    [{ label: "Years", value: 5, suffix: "+" }, "5+"],
    [{ label: "Players", value: 202 }, "202"],
    [{ label: "Users", value: 12000 }, "12,000"],
  ])("formats %o as %s", (stat, expected) => {
    expect(formatStat(stat)).toBe(expected);
  });
});

describe("validateResume: contact and pitch", () => {
  it.each(["", "alex", "alex@", "@example.com", "alex@example", "alex @example.com", "mailto:alex@example.com"])(
    "rejects the email %j",
    (email) => {
      const cv = fixture();
      cv.contact.email = email;
      expect(validateResume(cv)).toContainEqual(expect.stringContaining("contact.email"));
    },
  );

  it.each([
    [160, true],
    [161, false],
  ])("a %i-character pitch is valid: %s", (length, valid) => {
    const cv = fixture();
    cv.pitch = "x".repeat(length);
    const errors = validateResume(cv).filter((e) => e.startsWith("pitch"));
    expect(errors.length === 0).toBe(valid);
  });
});

describe("toPersonJsonLd", () => {
  it("describes the person for search engines", () => {
    expect(toPersonJsonLd(fixture())).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Alex Example",
      jobTitle: "Platform Engineer",
      description: "Platform engineer who ships reliable data systems.",
      email: "mailto:alex@example.com",
      address: { "@type": "PostalAddress", addressLocality: "Derry", addressCountry: "United Kingdom" },
      sameAs: ["https://github.com/alex-example"],
    });
  });

  it("lists LinkedIn alongside GitHub when present", () => {
    const cv = fixture();
    cv.contact.linkedin = "https://www.linkedin.com/in/alex-example";
    expect(toPersonJsonLd(cv).sameAs).toEqual([
      "https://github.com/alex-example",
      "https://www.linkedin.com/in/alex-example",
    ]);
  });
});
