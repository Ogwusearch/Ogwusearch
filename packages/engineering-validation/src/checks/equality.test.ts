import { describe, expect, it } from "vitest";
import { equality } from "./equality.js";

describe("equality", () => {
  it("passes when values are equal", () => {
    const issues = equality(10).check(10, {});

    expect(issues).toHaveLength(0);
  });

  it("fails when values are different", () => {
    const issues = equality(10).check(5, {});

    expect(issues).toHaveLength(1);
  });
});