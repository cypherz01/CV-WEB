import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Projects } from "./projects";

const card = (name: string) => screen.getByRole("heading", { level: 3, name }).closest("article")!;

describe("Projects border beam", () => {
  it("gives the featured card a decorative beam, hidden from assistive tech", () => {
    render(<Projects cv={fixture()} />);

    const beam = card("Pipeline Kit").querySelector("[data-border-beam]");
    expect(beam).not.toBeNull();
    expect(beam).toHaveAttribute("aria-hidden", "true");
  });

  it("gives the other cards no beam", () => {
    render(<Projects cv={fixture()} />);

    expect(card("Cost Lens").querySelector("[data-border-beam]")).toBeNull();
  });
});
