import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { About } from "./about";

describe("About", () => {
  it("has an About heading and the summary", () => {
    render(<About cv={fixture()} />);

    expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeInTheDocument();
    expect(screen.getByText("Alex builds data platforms. Alex likes boring technology.")).toBeInTheDocument();
  });

  it("shows each stat's label and final value", () => {
    render(<About cv={fixture()} />);

    expect(screen.getByText("Years shipping")).toBeInTheDocument();
    expect(screen.getByText("7+")).toBeInTheDocument();
    expect(screen.getByText("Budget managed")).toBeInTheDocument();
    expect(screen.getByText("£40k")).toBeInTheDocument();
  });
});
