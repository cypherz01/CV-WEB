import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("home page", () => {
  it("has a main landmark for the page content", () => {
    render(<Page />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
