import { describe, expect, it } from "vitest";

import { asEngineeringId } from "../src/common/identifier.js";

describe("asEngineeringId", () => {
  it("preserves a valid identifier", () => {
    const id = "calc-test-001";

    expect(asEngineeringId(id)).toBe(id);
  });

  it("rejects an empty identifier", () => {
    expect(() => asEngineeringId("")).toThrow(
      "Engineering identifier cannot be empty.",
    );
  });

  it("rejects a whitespace-only identifier", () => {
    expect(() => asEngineeringId("   ")).toThrow(
      "Engineering identifier cannot be empty.",
    );
  });

  it("does not normalize a non-empty identifier", () => {
    const id = "  calc-test-001  ";

    expect(asEngineeringId(id)).toBe(id);
  });
});
