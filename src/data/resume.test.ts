import { describe, expect, it } from "vitest";
import { validateResume } from "@/lib/cv";
import { resume } from "./resume";

// CI guard on content edits: any change to resume.ts that breaks a content rule fails the build.
describe("real CV content", () => {
  it("passes every content rule", () => {
    expect(validateResume(resume)).toEqual([]);
  });
});
