import { describe, expect, it } from "vitest";
import {
  createError,
  createWarning,
} from "../../src/index.js";

describe("result helpers", () => {
  it("creates an error", () => {
    const error = createError(
      "INVALID_POWER",
      "Power must be positive.",
      "power",
    );

    expect(error.severity).toBe("ERROR");
    expect(error.code).toBe("INVALID_POWER");
  });

  it("creates a warning", () => {
    const warning = createWarning(
      "HIGH_UTILIZATION",
      "Utilization is high.",
      "utilization",
    );

    expect(warning.severity).toBe("WARNING");
    expect(warning.code).toBe("HIGH_UTILIZATION");
  });
});
