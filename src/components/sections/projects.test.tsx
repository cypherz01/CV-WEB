import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fixture } from "@/test/resume-fixture";
import { Projects } from "./projects";

const card = (name: string) => screen.getByRole("heading", { level: 3, name }).closest("article")!;

describe("Projects", () => {
  it("renders one card per project", () => {
    render(<Projects cv={fixture()} />);

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(within(card("Pipeline Kit")).getByText("Toolkit for testing data pipelines locally.")).toBeInTheDocument();
  });

  it("links to live sites and code only where the URLs exist", () => {
    render(<Projects cv={fixture()} />);

    const kit = within(card("Pipeline Kit"));
    expect(kit.getByRole("link", { name: /code/i })).toHaveAttribute(
      "href",
      "https://github.com/alex-example/pipeline-kit",
    );
    expect(kit.queryByRole("link", { name: /live/i })).toBeNull();

    const lens = within(card("Cost Lens"));
    expect(lens.getByRole("link", { name: /live/i })).toHaveAttribute("href", "https://costlens.example.com");
    expect(lens.queryByRole("link", { name: /code/i })).toBeNull();
  });

  it("shows tech badges and no image space when a project has no image", () => {
    render(<Projects cv={fixture()} />);

    const kit = within(card("Pipeline Kit"));
    expect(kit.getByRole("list", { name: "Technologies" })).toHaveTextContent("Go");
    expect(kit.queryByRole("img")).toBeNull();
    expect(card("Pipeline Kit").querySelector("img, figure, picture")).toBeNull();
  });

  it("gives a project image alt text when there is one", () => {
    const cv = fixture();
    cv.projects[1].image = "/projects/cost-lens.webp";
    render(<Projects cv={cv} />);

    expect(within(card("Cost Lens")).getByRole("img", { name: /Cost Lens/ })).toBeInTheDocument();
  });
});
