import { describe, expect, it } from "vitest";
import {
  hasValidationErrors,
} from "../../src/index.js";

describe("hasValidationErrors", () => {
  it("returns false when there are no errors", () => {
    expect(
      hasValidationErrors([]),
    ).toBe(false);
  });

  it("returns true when an error exists", () => {
    expect(
      hasValidationErrors([
        {
          code: "INVALID",
          severity: "ERROR",
          message: "Invalid.",
        },
      ]),
    ).toBe(true);
  });
});
