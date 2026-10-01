// ============================================================
// @ogwusearch/engineering-core
// Result Invariant Tests
// ============================================================

import { describe, expect, it } from "vitest";

import { createResult } from "../../src/result/create-result.js";

describe("createResult", () => {
  const baseResult = {
    status: "SUCCESS" as const,
    valid: true,
    errors: [],
    warnings: [],
    assumptions: [],
    trace: {
      steps: [],
    },
    metadata: {},
  };

  it("returns ERROR and invalid when errors exist", () => {
    const result = createResult({
      ...baseResult,
      errors: [
        {
          code: "TEST_ERROR",
          severity: "ERROR" as const,
          message: "Test error.",
        },
      ],
    });

    expect(result.status).toBe("ERROR");
    expect(result.valid).toBe(false);
  });

  it("returns ERROR and invalid when valid is false", () => {
    const result = createResult({
      ...baseResult,
      valid: false,
    });

    expect(result.status).toBe("ERROR");
    expect(result.valid).toBe(false);
  });

  it("returns WARNING and remains valid when warnings exist", () => {
    const result = createResult({
      ...baseResult,
      warnings: [
        {
          code: "TEST_WARNING",
          severity: "WARNING" as const,
          message: "Test warning.",
        },
      ],
    });

    expect(result.status).toBe("WARNING");
    expect(result.valid).toBe(true);
  });

  it("returns SUCCESS when valid with no errors or warnings", () => {
    const result = createResult(baseResult);

    expect(result.status).toBe("SUCCESS");
    expect(result.valid).toBe(true);
  });
});
