import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Contact } from "./contact";

describe("Contact", () => {
  it("has a mailto link to the email address and the availability line", () => {
    render(<Contact cv={fixture()} />);

    expect(screen.getByRole("heading", { level: 2, name: "Contact" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /alex@example\.com/ })).toHaveAttribute("href", "mailto:alex@example.com");
    expect(screen.getByText("Open to platform roles.")).toBeInTheDocument();
  });

  it("opens external profiles in a new tab with rel=noopener", () => {
    const cv = fixture();
    cv.contact.linkedin = "https://www.linkedin.com/in/alex-example";
    render(<Contact cv={cv} />);

    const external = screen.getAllByRole("link").filter((a) => a.getAttribute("href")!.startsWith("http"));
    expect(external.map((a) => a.getAttribute("href"))).toEqual([
      "https://github.com/alex-example",
      "https://www.linkedin.com/in/alex-example",
    ]);
    for (const link of external) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")).toMatch(/\bnoopener\b/);
    }
  });

  it("leaves out profiles that are not in the data", () => {
    render(<Contact cv={fixture()} />);

    expect(screen.queryByRole("link", { name: /linkedin/i })).toBeNull();
  });
});
