import { describe, expect, it } from "vitest";

import {
  calculateGenerator,
} from "../calculation/index.js";

import {
  runGenerator,
} from "../run.js";

import type {
  GeneratorInput,
} from "../types/index.js";

describe("Generator regression", () => {
  it("produces deterministic calculation results", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
      },
      generator: {
        capacityVA: 40_000,
        voltageV: 230,
        frequencyHz: 50,
        phase: 1,
      },
      design: {
        designMargin: 0.1,
      },
      electrical: {
        requiredVoltageV: 230,
        requiredFrequencyHz: 50,
        requiredPhase: 1,
      },
    };

    const first =
      calculateGenerator(input);

    const second =
      calculateGenerator(input);

    expect(second)
      .toEqual(first);
  });

  it("does not mutate the input", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
      },
      generator: {
        capacityVA: 40_000,
        voltageV: 230,
        frequencyHz: 50,
        phase: 1,
      },
      design: {
        designMargin: 0.1,
        powerFactor: 0.8,
      },
      electrical: {
        requiredVoltageV: 230,
        requiredFrequencyHz: 50,
        requiredPhase: 1,
      },
    };

    const before =
      structuredClone(input);

    calculateGenerator(input);

    expect(input)
      .toEqual(before);
  });

  it("does not replace an upstream apparent-power requirement", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 40_000,
      },
      design: {
        powerFactor: 0.8,
      },
    };

    const result =
      calculateGenerator(input);

    expect(
      result.capacity.requiredApparentPowerVA,
    ).toBe(40_000);
  });

  it("does not apply a hidden generator design margin", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
      },
    };

    const result =
      calculateGenerator(input);

    expect(
      result.capacity.requiredApparentPowerVA,
    ).toBe(30_000);

    expect(
      result.capacity.designMargin,
    ).toBeUndefined();
  });

  it("applies only an explicitly supplied generator margin", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
      },
      design: {
        designMargin: 0.2,
      },
    };

    const result =
      calculateGenerator(input);

    expect(
      result.capacity.requiredApparentPowerVA,
    ).toBe(36_000);
  });

  it("does not invent a starting-demand factor", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
        startingDemandW: 36_000,
      },
    };

    const result =
      calculateGenerator(input);

    expect(
      result.capacity.requiredApparentPowerVA,
    ).toBe(30_000);

    expect(
      result.requirement.startingDemandW,
    ).toBe(36_000);
  });

  it("does not invent generator efficiency", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
      },
    };

    const result =
      calculateGenerator(input);

    expect(
      result.capacity.requiredApparentPowerVA,
    ).toBe(30_000);

    expect(
      "efficiency" in result.capacity,
    ).toBe(false);
  });

  it("does not modify a supplied generator rating", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
      },
      generator: {
        capacityVA: 35_000,
      },
    };

    const result =
      calculateGenerator(input);

    expect(
      result.generatorCapacityVA,
    ).toBe(35_000);

    expect(
      result.capacityMargin?.generatorCapacityVA,
    ).toBe(35_000);
  });

  it("does not perform commercial generator selection", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
      },
    };

    const result =
      calculateGenerator(input);

    expect(
      "selectedGenerator" in result,
    ).toBe(false);

    expect(
      "product" in result,
    ).toBe(false);

    expect(
      "vendor" in result,
    ).toBe(false);
  });

  it("returns a successful CalculationResult for valid input", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 24_000,
        requiredApparentPowerVA: 30_000,
      },
    };

    const result =
      runGenerator(input);

    expect(result.valid)
      .toBe(true);

    expect(result.status)
      .toBe("SUCCESS");

    expect(result.errors)
      .toHaveLength(0);

    expect(result.value)
      .toBeDefined();
  });

  it("blocks calculation for invalid input", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 0,
      },
    };

    const result =
      runGenerator(input);

    expect(result.valid)
      .toBe(false);

    expect(result.status)
      .toBe("ERROR");

    expect(result.errors.length)
      .toBeGreaterThan(0);

    expect(result.value)
      .toBeUndefined();
  });

  it("retains the upstream requirement in the result", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 20_000,
        requiredApparentPowerVA: 25_000,
        startingDemandW: 30_000,
        source: "peak-demand",
      },
    };

    const result =
      runGenerator(input);

    expect(result.valid)
      .toBe(true);

    expect(result.value?.requirement)
      .toEqual(input.requirement);
  });

  it("produces trace data for a successful calculation", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 20_000,
        requiredApparentPowerVA: 25_000,
      },
      generator: {
        capacityVA: 30_000,
      },
    };

    const result =
      runGenerator(input);

    expect(result.valid)
      .toBe(true);

    expect(result.trace)
      .toBeDefined();

    expect(result.trace.steps.length)
      .toBeGreaterThan(0);

    expect(
      result.trace.steps.some(
        (step) =>
          step.name ===
          "Generator Required Power",
      ),
    ).toBe(true);

    expect(
      result.trace.steps.some(
        (step) =>
          step.name ===
          "Generator Apparent Power",
      ),
    ).toBe(true);

    expect(
      result.trace.steps.some(
        (step) =>
          step.name ===
          "Generator Capacity Margin",
      ),
    ).toBe(true);
  });

  it("returns assumptions actually consumed by the calculation", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 20_000,
      },
      design: {
        powerFactor: 0.8,
        designMargin: 0.1,
      },
    };

    const result =
      runGenerator(input);

    expect(result.valid)
      .toBe(true);

    expect(
      result.assumptions.some(
        (assumption) =>
          assumption.code ===
          "GENERATOR_POWER_FACTOR",
      ),
    ).toBe(true);

    expect(
      result.assumptions.some(
        (assumption) =>
          assumption.code ===
          "GENERATOR_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });
});