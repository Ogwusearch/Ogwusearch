import { describe, expect, it } from "vitest";

import { runProtectionSizing } from "../run.js";

describe("protection regression", () => {
  it("blocks calculation when validation fails", () => {
    const result = runProtectionSizing({
      protection: {
        type: "AC_BREAKER",
        mode: "AC",
      },
      electrical: {
        operatingCurrentA: 0,
        systemVoltageV: 230,
      },
    });

    expect(result.status).toBe("ERROR");
    expect(result.valid).toBe(false);
    expect(result.value).toBeUndefined();
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.warnings).toHaveLength(0);
    expect(result.trace.steps).toHaveLength(0);
  });

  it("returns the same result for the same input", () => {
    const input = {
      protection: {
        type: "AC_BREAKER" as const,
        mode: "AC" as const,
      },
      electrical: {
        operatingCurrentA: 18,
        systemVoltageV: 230,
      },
      design: {
        designMargin: 0.2,
      },
      device: {
        availableCurrentRatingsA: [16, 20, 25, 32],
        voltageRatingV: 400,
      },
    };

    const a = runProtectionSizing(input);
    const b = runProtectionSizing(input);

    expect(a).toEqual(b);
    expect(a.valid).toBe(true);
    expect(a.status).toBe("SUCCESS");
    expect(a.value).toBeDefined();
  });

  it("does not mutate input", () => {
    const input = {
      protection: {
        type: "DC_FUSE" as const,
        mode: "DC" as const,
      },
      electrical: {
        operatingCurrentA: 20,
        systemVoltageV: 48,
        shortCircuitCurrentA: 25,
      },
      design: {
        designMargin: 0.2,
      },
      device: {
        availableCurrentRatingsA: [25, 32, 40],
      },
    };

    const before = structuredClone(input);

    runProtectionSizing(input);

    expect(input).toEqual(before);
  });

  it("produces a warning without invalidating a calculation", () => {
    const result = runProtectionSizing({
      protection: {
        type: "AC_BREAKER",
        mode: "AC",
      },
      electrical: {
        operatingCurrentA: 18,
        systemVoltageV: 230,
      },
      design: {
        designMargin: 0.2,
      },
      device: {
        currentRatingA: 20,
      },
    });

    console.log(JSON.stringify(result, null, 2));

    expect(result.status).toBe("WARNING");
    expect(result.valid).toBe(true);
    expect(result.value).toBeDefined();
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
    expect(
      result.warnings[0]?.code,
    ).toBe("PROTECTIVE_CURRENT_RATING_INSUFFICIENT");
  });
});