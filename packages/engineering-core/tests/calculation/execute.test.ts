import { describe, expect, it } from "vitest";
import {
  executeCalculation,
} from "../../src/index.js";

describe("executeCalculation", () => {
  it("executes a valid calculation", () => {
    const result = executeCalculation(
      {
        name: "addition",
        calculate: (input: {
          a: number;
          b: number;
        }) => input.a + input.b,
      },
      {
        a: 2,
        b: 3,
      },
    );

    expect(result.valid).toBe(true);
    expect(result.status).toBe("SUCCESS");
    expect(result.value).toBe(5);
  });

  it("does not calculate invalid input", () => {
    const result = executeCalculation(
      {
        name: "positive-value",
        validate: () => [
          {
            code: "INVALID",
            severity: "ERROR",
            message: "Invalid input.",
          },
        ],
        calculate: () => 100,
      },
      {},
    );

    expect(result.valid).toBe(false);
    expect(result.status).toBe("ERROR");
    expect(result.value).toBeUndefined();
  });

  it("returns warning status when warnings exist", () => {
    const result = executeCalculation(
      {
        name: "warning-test",
        validate: () => [
          {
            code: "HIGH_UTILIZATION",
            severity: "WARNING",
            message: "High utilization.",
          },
        ],
        calculate: () => 50,
      },
      {},
    );

    expect(result.valid).toBe(true);
    expect(result.status).toBe("WARNING");
    expect(result.warnings).toHaveLength(1);
  });
});
