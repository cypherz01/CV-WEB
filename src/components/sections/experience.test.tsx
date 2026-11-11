import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Experience } from "./experience";

const roleEntry = (title: string) => screen.getByRole("heading", { level: 3, name: title }).closest("li")!;

describe("Experience", () => {
  it("lists one entry per role, newest first, whatever order the data is in", () => {
    const cv = fixture();
    cv.work.reverse();
    render(<Experience cv={cv} />);

    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(["Senior Platform Engineer", "Data Engineer"]);
  });

  it("shows each role's company and date range", () => {
    render(<Experience cv={fixture()} />);

    const current = within(roleEntry("Senior Platform Engineer"));
    expect(current.getByText("Northwind")).toBeInTheDocument();
    expect(current.getByText("Mar 2023 – Present")).toBeInTheDocument();

    const past = within(roleEntry("Data Engineer"));
    expect(past.getByText("Contoso")).toBeInTheDocument();
    expect(past.getByText("2019 – 2023")).toBeInTheDocument();
  });

  it("keeps the bullets behind a collapsed button that a click opens", async () => {
    render(<Experience cv={fixture()} />);
    const toggle = screen.getByRole("button", { name: /at Northwind/ });
    const bullet = screen.getByText("Cut deploy time by 60%.");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(bullet).not.toBeVisible();

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(bullet).toBeVisible();
  });

  it("toggles the bullets with Enter and Space", async () => {
    const user = userEvent.setup();
    render(<Experience cv={fixture()} />);
    const toggle = screen.getByRole("button", { name: /at Contoso/ });
    const bullet = screen.getByText("Built 12 pipelines.");

    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(bullet).toBeVisible();

    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(bullet).not.toBeVisible();
  });

  it("shows the role's technologies as a labelled list of badges", () => {
    render(<Experience cv={fixture()} />);

    const tech = within(roleEntry("Senior Platform Engineer")).getByRole("list", { name: "Technologies" });
    expect(within(tech).getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Go", "Kubernetes"]);
    expect(within(roleEntry("Data Engineer")).queryByRole("list", { name: "Technologies" })).toBeNull();
  });
});
