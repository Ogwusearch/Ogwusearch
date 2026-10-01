import { describe, expect, it } from "vitest";

import {
  validateSystem,
  validateSystemInput,
} from "../validation/index.js";

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

describe("system-validation validation", () => {
  it("rejects an empty system-validation input", () => {
    const issues =
      validateSystem({});

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "SYSTEM_INPUT_COMPLETE",
      ),
    ).toBe(true);
  });

  it("accepts an authoritative engineering result", () => {
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
    };

    const issues =
      validateSystemInput(input);

    expect(issues).toHaveLength(0);
  });

  it("accepts additional results", () => {
    const input: SystemValidationInput = {
      additionalResults: [
        successfulResult({
          value: "additional",
        }),
      ],
    };

    const issues =
      validateSystemInput(input);

    expect(issues).toHaveLength(0);
  });

  it("reports missing inverter when peak demand is supplied", () => {
    const input: SystemValidationInput = {
      peakDemand: successfulResult({
        designPeakDemandW: 6_000,
        startingDemandW: 8_000,
      }),
    };

    const issues =
      validateSystemInput(input);

    expect(
      issues.some(
        (issue) =>
          issue.code ===
            "MISSING_REQUIRED_RESULT" &&
          issue.path === "inverter",
      ),
    ).toBe(true);
  });

  it("reports missing protection when cable is supplied", () => {
    const input: SystemValidationInput = {
      cable: successfulResult({
        mode: "DC",
        operatingCurrentA: 40,
        designCurrentA: 48,
        requiredAmpacityA: 48,
        selectedConductorAreaMm2: 10,
        selectedConductorAmpacityA: 60,
        conductorMaterial: "Copper",
        conductorCount: 2,
      }),
    };

    const issues =
      validateSystemInput(input);

    expect(
      issues.some(
        (issue) =>
          issue.code ===
            "MISSING_REQUIRED_RESULT" &&
          issue.path === "protection",
      ),
    ).toBe(true);
  });

  it("does not mutate the input", () => {
    const input: SystemValidationInput = {
      pvArray: successfulResult({
        totalModules: 10,
        arrayPowerW: 5_500,
      }),
    };

    const before =
      structuredClone(input);

    validateSystemInput(input);

    expect(input).toEqual(before);
  });
});