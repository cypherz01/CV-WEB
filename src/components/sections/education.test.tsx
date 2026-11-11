import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Education } from "./education";

describe("Education", () => {
  it("shows the qualification, institution and years for each entry", () => {
    const cv = fixture();
    cv.education.push({ qualification: "MSc Statistics", institution: "Sample College", end: "2018" });
    render(<Education cv={cv} />);

    const [first, second] = screen.getAllByRole("listitem");
    expect(within(first).getByRole("heading", { level: 3, name: "BSc Mathematics" })).toBeInTheDocument();
    expect(within(first).getByText("Example University")).toBeInTheDocument();
    expect(within(first).getByText("2012 – 2016")).toBeInTheDocument();

    // No start date: show only the year it finished.
    expect(within(second).getByRole("heading", { level: 3, name: "MSc Statistics" })).toBeInTheDocument();
    expect(within(second).getByText("Sample College")).toBeInTheDocument();
    expect(within(second).getByText("2018")).toBeInTheDocument();
  });
});
