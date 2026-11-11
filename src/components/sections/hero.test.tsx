import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Hero } from "./hero";

describe("Hero", () => {
  it("has exactly one h1, with the name", () => {
    render(<Hero cv={fixture()} />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Alex Example");
  });

  it("shows the avatar with the name as alt text", () => {
    render(<Hero cv={fixture()} />);

    expect(screen.getByRole("img", { name: "Alex Example" })).toBeInTheDocument();
  });

  it("shows the first role and the location", () => {
    render(<Hero cv={fixture()} />);

    expect(screen.getByText("Platform Engineer")).toBeInTheDocument();
    expect(screen.getByText("Derry, United Kingdom")).toBeInTheDocument();
  });

  it("links to the CV PDF and to the contact section", () => {
    render(<Hero cv={fixture()} />);

    // Unit tests build with no base path, so the PDF sits at the site root.
    expect(screen.getByRole("link", { name: /download cv/i })).toHaveAttribute("href", "/cv.pdf");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "#contact");
  });
});
