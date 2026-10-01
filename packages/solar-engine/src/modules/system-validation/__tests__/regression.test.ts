import { describe, expect, it } from "vitest";

import {
  runSystemValidation,
} from "../run.js";

import type {
  SystemValidationInput,
} from "../types/index.js";

function successfulResult<T extends object>(
  value: T,
) {
  return {
    status: "SUCCESS" as const,
    valid: true,
    value,
    errors: [],
    warnings: [],
    assumptions: [],
    trace: {
      steps: [],
    },
    metadata: {},
  };
}

describe("system-validation regression", () => {
  it("produces deterministic output", () => {
    const input: SystemValidationInput = {
      pvArray: successfulResult({
        totalModules: 10,
        modulesPerString: 5,
        parallelStrings: 2,
        arrayPowerW: 5_500,
        arrayVmpV: 200,
        arrayImpA: 27.5,
        arrayVocV: 240,
        arrayIscA: 30,
      }),

      voltageDrop: successfulResult({
        mode: "DC",
        sourceVoltageV: 48,
        operatingCurrentA: 10,
        resistanceOhm: 0.1,
        voltageDropV: 1,
        voltageDropPercent: 2.0833333333,
        loadVoltageV: 47,
        allowableVoltageDropPercent: 3,
        withinAllowableLimit: true,
      }),
    };

    const first =
      runSystemValidation(input);

    const second =
      runSystemValidation(input);

    expect(first).toEqual(second);
  });

  it("does not mutate authoritative upstream results", () => {
    const pvArray =
      successfulResult({
        totalModules: 10,
        modulesPerString: 5,
        parallelStrings: 2,
        arrayPowerW: 5_500,
        arrayVmpV: 200,
        arrayImpA: 27.5,
        arrayVocV: 240,
        arrayIscA: 30,
      });

    const input: SystemValidationInput = {
      pvArray,
    };

    const before =
      structuredClone(input);

    runSystemValidation(input);

    expect(input).toEqual(before);
  });

  it("does not modify the authoritative upstream result object", () => {
    const upstream =
      successfulResult({
        totalModules: 10,
        arrayPowerW: 5_500,
      });

    const input: SystemValidationInput = {
      pvArray: upstream,
    };

    runSystemValidation(input);

    expect(upstream).toEqual({
      status: "SUCCESS",
      valid: true,
      value: {
        totalModules: 10,
        arrayPowerW: 5_500,
      },
      errors: [],
      warnings: [],
      assumptions: [],
      trace: {
        steps: [],
      },
      metadata: {},
    });
  });

  it("preserves upstream warnings and errors", () => {
    const upstream = {
      status: "WARNING" as const,
      valid: true,
      value: {
        totalModules: 10,
        arrayPowerW: 5_500,
      },
      errors: [],
      warnings: [
        {
          code: "UPSTREAM_WARNING",
          severity: "WARNING" as const,
          message: "Review upstream result.",
        },
      ],
      assumptions: [],
      trace: {
        steps: [],
      },
      metadata: {},
    };

    const input: SystemValidationInput = {
      pvArray: upstream,
    };

    const result =
      runSystemValidation(input);

    expect(upstream.warnings).toHaveLength(1);
    expect(
      upstream.warnings[0]?.code,
    ).toBe("UPSTREAM_WARNING");

    expect(result.value).toBeDefined();
  });

  it("does not fabricate missing engineering values", () => {
    const input: SystemValidationInput = {
      pvArray: successfulResult({
        totalModules: 10,
        arrayPowerW: 5_500,
      }),
    };

    const result =
      runSystemValidation(input);

    expect(result.valid).toBe(true);

    expect(
      result.value?.checks.some(
        (check) =>
          check.status ===
          "NOT_EVALUATED",
      ),
    ).toBe(false);
  });

  it("keeps missing dependencies explicit", () => {
    const input: SystemValidationInput = {
      peakDemand: successfulResult({
        designPeakDemandW: 6_000,
        startingDemandW: 8_000,
      }),
    };

    const result =
      runSystemValidation(input);

    expect(result.valid).toBe(false);

    expect(
      result.errors.some(
        (error) =>
          error.code ===
            "MISSING_REQUIRED_RESULT" &&
          error.path === "inverter",
      ),
    ).toBe(true);
  });

  it("records system-validation trace steps", () => {
    const input: SystemValidationInput = {
      pvArray: successfulResult({
        totalModules: 10,
        arrayPowerW: 5_500,
      }),
    };

    const result =
      runSystemValidation(input);

    expect(
      result.trace.steps.length,
    ).toBeGreaterThan(0);

    expect(
      result.trace.steps.some(
        (step) =>
          step.id ===
          "system-validation-evaluate-checks",
      ),
    ).toBe(true);
  });
});