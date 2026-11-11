import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Hero } from "./hero";
import { Skills } from "./skills";

/** jsdom has no matchMedia: stub one that answers min-width queries for a given screen width. */
function screenWidth(width: number) {
  vi.stubGlobal("matchMedia", (query: string) => {
    const min = /min-width:\s*(\d+)px/.exec(query);
    return {
      matches: min ? width >= Number(min[1]) : false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  });
}

afterEach(() => vi.unstubAllGlobals());

describe("decorative backgrounds", () => {
  it("puts an aria-hidden DotPattern behind the hero", () => {
    const { container } = render(<Hero cv={fixture()} />);

    const dots = container.querySelector("[data-dot-pattern]");
    expect(dots).not.toBeNull();
    expect(dots).toHaveAttribute("aria-hidden", "true");
  });

  it("shows an aria-hidden IconCloud in Skills on wide screens", () => {
    screenWidth(1280);
    const { container } = render(<Skills cv={fixture()} />);

    const cloud = container.querySelector("[data-icon-cloud]");
    expect(cloud).not.toBeNull();
    expect(cloud).toHaveAttribute("aria-hidden", "true");
    expect(cloud!.querySelector("a, button, [tabindex]")).toBeNull(); // nothing focusable inside aria-hidden
  });

  it("leaves the IconCloud out of the DOM entirely at 375 px", () => {
    screenWidth(375);
    const { container } = render(<Skills cv={fixture()} />);

    expect(container.querySelector("[data-icon-cloud]")).toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
