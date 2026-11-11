import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Skills } from "./skills";

describe("Skills", () => {
  it("renders an h3 per group in the data, in order, with that group's badges", () => {
    render(<Skills cv={fixture()} />);

    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Languages", "Tools"]);
    const languages = screen.getByRole("list", { name: "Languages" });
    expect(within(languages).getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Go", "SQL"]);
  });

  it("renders a group added to the data with no component change", () => {
    const cv = fixture();
    cv.skills["Cloud"] = ["AWS", "GCP"];
    render(<Skills cv={cv} />);

    expect(screen.getByRole("heading", { level: 3, name: "Cloud" })).toBeInTheDocument();
    expect(within(screen.getByRole("list", { name: "Cloud" })).getByText("GCP")).toBeInTheDocument();
  });
});
