import {
  describe,
  expect,
  it,
} from "vitest";

import {
  runEarthingSizing,
} from "../run.js";

describe("earthing regression", () => {
  it("blocks calculation when validation fails", () => {
    const result =
      runEarthingSizing({
        mode: "AC",

        electrical: {
          faultCurrentA: 0,
          faultClearingTimeS: 0.2,
          conductorConstantA_SqrtS_PerMm2: 115,
        },
      });

    expect(result.status).toBe(
      "ERROR",
    );

    expect(result.valid).toBe(
      false,
    );

    expect(result.value).toBeUndefined();

    expect(
      result.errors.length,
    ).toBeGreaterThan(0);

    expect(
      result.warnings,
    ).toHaveLength(0);

    expect(
      result.trace.steps,
    ).toHaveLength(0);
  });

  it("returns the same result for the same input", () => {
    const input = {
      mode: "AC" as const,

      electrical: {
        faultCurrentA: 1000,
        faultClearingTimeS: 0.2,
        conductorConstantA_SqrtS_PerMm2: 115,
      },

      design: {
        designMargin: 0.2,
        bondingConductorFactor: 1,
      },
    };

    const a =
      runEarthingSizing(input);

    const b =
      runEarthingSizing(input);

    expect(a).toEqual(b);
    expect(a.valid).toBe(true);
    expect(a.status).toBe(
      "SUCCESS",
    );
    expect(a.value).toBeDefined();
  });

  it("does not mutate input", () => {
    const input = {
      mode: "DC" as const,

      electrical: {
        faultCurrentA: 500,
        faultClearingTimeS: 0.1,
        conductorConstantA_SqrtS_PerMm2: 115,
      },

      design: {
        designMargin: 0.2,
        bondingConductorFactor: 1,
      },
    };

    const before =
      structuredClone(input);

    runEarthingSizing(input);

    expect(input).toEqual(
      before,
    );
  });

  it("returns a warning when earth resistance exceeds the target", () => {
    const result =
      runEarthingSizing({
        mode: "AC",

        electrical: {
          faultCurrentA: 1000,
          faultClearingTimeS: 0.2,
          conductorConstantA_SqrtS_PerMm2: 115,
          resistivityOhmM: 100,
          electrodeLengthM: 1,
          electrodeDiameterM: 0.016,
        },

        design: {
          earthResistanceTargetOhm: 1,
        },
      });

    expect(result.status).toBe(
      "WARNING",
    );

    expect(result.valid).toBe(
      true,
    );

    expect(result.value).toBeDefined();

    expect(result.errors).toHaveLength(
      0,
    );

    expect(result.warnings).toHaveLength(
      1,
    );

    expect(
      result.warnings[0]?.code,
    ).toBe(
      "EARTH_RESISTANCE_TARGET_EXCEEDED",
    );
  });
});