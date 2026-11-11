import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Footer } from "./footer";

describe("Footer", () => {
  it("shows when the CV was last updated, as a machine-readable date", () => {
    render(<Footer cv={fixture()} />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("Last updated 15 January 2026");
    expect(footer.querySelector("time")).toHaveAttribute("datetime", "2026-01-15");
  });
});
