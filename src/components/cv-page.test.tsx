import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { CvPage } from "./cv-page";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

describe("CV page", () => {
  it("starts with a 'Skip to content' link that targets main", () => {
    const { container } = render(<CvPage cv={fixture()} />);

    const first = container.querySelector<HTMLElement>(FOCUSABLE)!;
    expect(first).toHaveAccessibleName("Skip to content");
    const target = first.getAttribute("href")!;
    expect(container.querySelector(target)).toBe(screen.getByRole("main"));
  });

  it("has an anchor for every section", () => {
    const { container } = render(<CvPage cv={fixture()} />);

    for (const id of ["top", "about", "work", "skills", "projects", "education", "contact"]) {
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });

  it("puts no phone number anywhere in the page", () => {
    const { container } = render(<CvPage cv={fixture()} />);

    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
    // UK and international formats: a run of 10+ digits, allowing spaces, dashes and a leading +.
    expect(container.textContent).not.toMatch(/\+?\d[\d\s-]{9,}\d/);
  });

  it("renders a role added to the data with no component change", () => {
    const cv = fixture();
    cv.work.push({
      company: "Fabrikam",
      title: "Junior Analyst",
      start: "2017-06",
      end: "2019-01",
      highlights: ["Automated 5 weekly reports.", "Wrote the team's first tests."],
    });
    render(<CvPage cv={cv} />);

    expect(screen.getByRole("heading", { level: 3, name: "Junior Analyst" })).toBeInTheDocument();
    expect(screen.getByText("Fabrikam")).toBeInTheDocument();
    expect(screen.getByText("June 2017 – Jan 2019")).toBeInTheDocument();
    expect(screen.getByText("Automated 5 weekly reports.")).toBeInTheDocument();
  });
});
