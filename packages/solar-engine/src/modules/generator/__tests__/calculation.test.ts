import { describe, expect, it } from "vitest";

import {
  calculateApparentPower,
  calculateCapacityMargin,
  calculateGeneratorCapacity,
  calculateGenerator,
} from "../calculation/index.js";

import type {
  GeneratorInput,
} from "../types/index.js";

describe("Generator calculations", () => {
  it("uses supplied upstream apparent power without recalculating it", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
    };

    const result = calculateApparentPower(input);

    expect(result).toBe(12_500);
  });

  it("derives apparent power from real power and power factor", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
      },
      design: {
        powerFactor: 0.8,
      },
    };

    const result = calculateApparentPower(input);

    expect(result).toBe(12_500);
  });

  it("uses unity power factor when no apparent power or power factor is supplied", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
      },
    };

    const result = calculateApparentPower(input);

    expect(result).toBe(10_000);
  });

  it("calculates capacity without an additional margin when none is supplied", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
    };

    const result =
      calculateGeneratorCapacity(input);

    expect(result.requiredPowerW).toBe(10_000);
    expect(result.requiredApparentPowerVA).toBe(12_500);
    expect(result.designMargin).toBeUndefined();
  });

  it("applies an explicitly supplied generator design margin", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
      design: {
        designMargin: 0.2,
      },
    };

    const result =
      calculateGeneratorCapacity(input);

    expect(result.requiredApparentPowerVA)
      .toBe(15_000);

    expect(result.designMargin)
      .toBe(0.2);
  });

  it("calculates generator capacity from real power and explicit power factor", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 16_000,
      },
      design: {
        powerFactor: 0.8,
      },
    };

    const result =
      calculateGeneratorCapacity(input);

    expect(result.requiredPowerW)
      .toBe(16_000);

    expect(result.requiredApparentPowerVA)
      .toBe(20_000);

    expect(result.powerFactor)
      .toBe(0.8);
  });

  it("calculates positive generator capacity margin", () => {
    const result =
      calculateCapacityMargin(
        20_000,
        16_000,
      );

    expect(result.generatorCapacityVA)
      .toBe(20_000);

    expect(result.requiredCapacityVA)
      .toBe(16_000);

    expect(result.marginVA)
      .toBe(4_000);

    expect(result.marginFraction)
      .toBe(0.25);

    expect(result.utilization)
      .toBe(0.8);
  });

  it("calculates negative generator capacity margin", () => {
    const result =
      calculateCapacityMargin(
        15_000,
        20_000,
      );

    expect(result.marginVA)
      .toBe(-5_000);

    expect(result.marginFraction)
      .toBe(-0.25);

    expect(result.utilization)
      .toBeCloseTo(
        20_000 / 15_000,
      );
  });

  it("calculates generator requirement without a supplied generator rating", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 20_000,
        requiredApparentPowerVA: 25_000,
      },
    };

    const result =
      calculateGenerator(input);

    expect(result.requirement)
      .toEqual(input.requirement);

    expect(result.capacity.requiredPowerW)
      .toBe(20_000);

    expect(result.capacity.requiredApparentPowerVA)
      .toBe(25_000);

    expect(result.capacityMargin)
      .toBeUndefined();

    expect(result.compatibility)
      .toBeUndefined();
  });

  it("verifies a supplied generator rating", () => {
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
      calculateGenerator(input);

    expect(result.capacity.requiredApparentPowerVA)
      .toBe(25_000);

    expect(result.capacityMargin)
      .toBeDefined();

    expect(result.capacityMargin?.marginVA)
      .toBe(5_000);

    expect(result.capacityMargin?.utilization)
      .toBeCloseTo(
        25_000 / 30_000,
      );

    expect(result.compatibility?.capacityCompatible)
      .toBe(true);
  });

  it("reports an insufficient supplied generator rating", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 20_000,
        requiredApparentPowerVA: 25_000,
      },
      generator: {
        capacityVA: 20_000,
      },
    };

    const result =
      calculateGenerator(input);

    expect(result.capacityMargin?.marginVA)
      .toBe(-5_000);

    expect(result.compatibility?.capacityCompatible)
      .toBe(false);
  });

  it("checks voltage compatibility when both values are supplied", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
      generator: {
        capacityVA: 15_000,
        voltageV: 230,
      },
      electrical: {
        requiredVoltageV: 230,
      },
    };

    const result =
      calculateGenerator(input);

    expect(result.compatibility?.voltageCompatible)
      .toBe(true);
  });

  it("reports voltage incompatibility", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
      generator: {
        capacityVA: 15_000,
        voltageV: 220,
      },
      electrical: {
        requiredVoltageV: 230,
      },
    };

    const result =
      calculateGenerator(input);

    expect(result.compatibility?.voltageCompatible)
      .toBe(false);
  });

  it("checks frequency compatibility", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
      generator: {
        capacityVA: 15_000,
        frequencyHz: 50,
      },
      electrical: {
        requiredFrequencyHz: 50,
      },
    };

    const result =
      calculateGenerator(input);

    expect(result.compatibility?.frequencyCompatible)
      .toBe(true);
  });

  it("reports frequency incompatibility", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
      generator: {
        capacityVA: 15_000,
        frequencyHz: 60,
      },
      electrical: {
        requiredFrequencyHz: 50,
      },
    };

    const result =
      calculateGenerator(input);

    expect(result.compatibility?.frequencyCompatible)
      .toBe(false);
  });

  it("checks phase compatibility", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
      generator: {
        capacityVA: 15_000,
        phase: 3,
      },
      electrical: {
        requiredPhase: 3,
      },
    };

    const result =
      calculateGenerator(input);

    expect(result.compatibility?.phaseCompatible)
      .toBe(true);
  });

  it("reports phase incompatibility", () => {
    const input: GeneratorInput = {
      requirement: {
        requiredPowerW: 10_000,
        requiredApparentPowerVA: 12_500,
      },
      generator: {
        capacityVA: 15_000,
        phase: 1,
      },
      electrical: {
        requiredPhase: 3,
      },
    };

    const result =
      calculateGenerator(input);

    expect(result.compatibility?.phaseCompatible)
      .toBe(false);
  });
});