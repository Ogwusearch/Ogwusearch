import { describe, expect, it } from "vitest";

import {
  validateGenerator,
} from "../validation/index.js";

import type {
  GeneratorInput,
} from "../types/index.js";

const validInput: GeneratorInput = {
  requirement: {
    requiredPowerW: 10_000,
  },
};

describe("Generator validation", () => {
  it("accepts a valid generator requirement", () => {
    const issues = validateGenerator(validInput);

    expect(issues).toHaveLength(0);
  });

  it("rejects non-positive required power", () => {
    const issues = validateGenerator({
      ...validInput,
      requirement: {
        requiredPowerW: 0,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_REQUIRED_POWER",
      ),
    ).toBe(true);
  });

  it("rejects invalid required apparent power", () => {
    const issues = validateGenerator({
      ...validInput,
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 0,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_REQUIRED_APPARENT_POWER",
      ),
    ).toBe(true);
  });

  it("rejects invalid starting demand", () => {
    const issues = validateGenerator({
      ...validInput,
      requirement: {
        requiredPowerW: 10_000,
        startingDemandW: 0,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_STARTING_DEMAND",
      ),
    ).toBe(true);
  });

  it("rejects invalid generator capacity", () => {
    const issues = validateGenerator({
      ...validInput,
      generator: {
        capacityVA: 0,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_GENERATOR_CAPACITY",
      ),
    ).toBe(true);
  });

  it("rejects power factor above 1", () => {
    const issues = validateGenerator({
      ...validInput,
      design: {
        powerFactor: 1.1,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_GENERATOR_POWER_FACTOR",
      ),
    ).toBe(true);
  });

  it("rejects zero power factor", () => {
    const issues = validateGenerator({
      ...validInput,
      design: {
        powerFactor: 0,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_GENERATOR_POWER_FACTOR",
      ),
    ).toBe(true);
  });

  it("rejects design margin below zero", () => {
    const issues = validateGenerator({
      ...validInput,
      design: {
        designMargin: -0.1,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_GENERATOR_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });

  it("rejects design margin above one", () => {
    const issues = validateGenerator({
      ...validInput,
      design: {
        designMargin: 1.1,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_GENERATOR_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });

  it("rejects invalid generator voltage", () => {
    const issues = validateGenerator({
      ...validInput,
      generator: {
        capacityVA: 20_000,
        voltageV: 0,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_GENERATOR_VOLTAGE",
      ),
    ).toBe(true);
  });

  it("rejects invalid generator frequency", () => {
    const issues = validateGenerator({
      ...validInput,
      generator: {
        capacityVA: 20_000,
        frequencyHz: 0,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_GENERATOR_FREQUENCY",
      ),
    ).toBe(true);
  });

  it("rejects invalid generator phase", () => {
    const issues = validateGenerator({
      ...validInput,
      generator: {
        capacityVA: 20_000,
        phase: 2 as 1 | 3,
      },
    });

    expect(
      issues.some(
        (item) => item.code === "INVALID_GENERATOR_PHASE",
      ),
    ).toBe(true);
  });

  it("rejects invalid required voltage", () => {
    const issues = validateGenerator({
      ...validInput,
      electrical: {
        requiredVoltageV: 0,
      },
    });

    expect(
      issues.some(
        (item) =>
          item.code === "INVALID_REQUIRED_GENERATOR_VOLTAGE",
      ),
    ).toBe(true);
  });

  it("rejects invalid required frequency", () => {
    const issues = validateGenerator({
      ...validInput,
      electrical: {
        requiredFrequencyHz: 0,
      },
    });

    expect(
      issues.some(
        (item) =>
          item.code === "INVALID_REQUIRED_GENERATOR_FREQUENCY",
      ),
    ).toBe(true);
  });

  it("rejects invalid required phase", () => {
    const issues = validateGenerator({
      ...validInput,
      electrical: {
        requiredPhase: 2 as 1 | 3,
      },
    });

    expect(
      issues.some(
        (item) =>
          item.code === "INVALID_REQUIRED_GENERATOR_PHASE",
      ),
    ).toBe(true);
  });

  it("collects multiple validation errors", () => {
    const issues = validateGenerator({
      requirement: {
        requiredPowerW: 0,
        requiredApparentPowerVA: -1,
        startingDemandW: 0,
      },
      generator: {
        capacityVA: 0,
        voltageV: 0,
        frequencyHz: 0,
        phase: 2 as 1 | 3,
      },
      design: {
        powerFactor: 2,
        designMargin: -1,
      },
      electrical: {
        requiredVoltageV: 0,
        requiredFrequencyHz: 0,
        requiredPhase: 2 as 1 | 3,
      },
    });

    expect(issues.length).toBeGreaterThan(1);
  });

  it("does not mutate the input", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
        startingDemandW: 15_000,
      },
      generator: {
        capacityVA: 20_000,
        voltageV: 230,
        frequencyHz: 50,
        phase: 1,
      },
      design: {
        powerFactor: 0.8,
        designMargin: 0.1,
      },
      electrical: {
        requiredVoltageV: 230,
        requiredFrequencyHz: 50,
        requiredPhase: 1,
      },
    };

    const before = structuredClone(input);

    validateGenerator(input);

    expect(input).toEqual(before);
  });
});