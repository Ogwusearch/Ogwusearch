import type {
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import {
  GENERATOR_WARNING_CODES,
} from "./constants.js";

import type {
  GeneratorInput,
  GeneratorOutput,
} from "./types/index.js";

/**
 * Create Generator warnings.
 *
 * Warnings do not invalidate the calculation.
 *
 * Generator warnings are based only on explicitly supplied
 * engineering information. No hidden derating, efficiency,
 * reserve, or starting assumptions are introduced here.
 */
export function createGeneratorWarnings(
  input: GeneratorInput,
  output: GeneratorOutput,
): EngineeringWarning[] {
  const warnings: EngineeringWarning[] = [];

  const margin = output.capacityMargin;

  if (margin !== undefined) {
    if (margin.marginFraction < 0) {
      warnings.push({
        code: GENERATOR_WARNING_CODES.CAPACITY_MARGIN_LOW,
        severity: "WARNING",
        message:
          "Generator capacity is below the required generator capacity.",
        path: "generator.capacityVA",
        expected: `>= ${margin.requiredCapacityVA} VA`,
        actual: margin.generatorCapacityVA,
        metadata: {
          extras: {
            requiredCapacityVA: margin.requiredCapacityVA,
            generatorCapacityVA: margin.generatorCapacityVA,
            marginVA: margin.marginVA,
            marginFraction: margin.marginFraction,
          },
        },
      });
    }

    if (margin.utilization > 1) {
      warnings.push({
        code: GENERATOR_WARNING_CODES.UTILIZATION_HIGH,
        severity: "WARNING",
        message:
          "Generator utilization exceeds 100% of the supplied generator rating.",
        path: "generator.capacityVA",
        expected: "<= 1",
        actual: margin.utilization,
        metadata: {
          extras: {
            requiredCapacityVA: margin.requiredCapacityVA,
            generatorCapacityVA: margin.generatorCapacityVA,
            utilization: margin.utilization,
          },
        },
      });
    }
  }

  const powerFactor =
    output.capacity.powerFactor ??
    input.generator?.powerFactor ??
    input.design?.powerFactor;

  if (
    powerFactor !== undefined &&
    powerFactor > 0 &&
    powerFactor < 0.8
  ) {
    warnings.push({
      code: GENERATOR_WARNING_CODES.POWER_FACTOR_LOW,
      severity: "WARNING",
      message:
        "Generator power factor is below the reference engineering threshold of 0.8.",
      path:
        input.design?.powerFactor !== undefined
          ? "design.powerFactor"
          : "generator.powerFactor",
      expected: ">= 0.8",
      actual: powerFactor,
      metadata: {
        extras: {
          powerFactor,
        },
      },
    });
  }

  /*
   * Starting-capacity warnings are intentionally not generated here.
   *
   * A starting-capacity requirement must come from an explicit upstream
   * engineering requirement. The Generator module must not invent a
   * motor-starting or surge factor.
   */

  /*
   * Electrical mismatch warnings are evaluated only when both the
   * requirement and supplied generator rating are available.
   */
  const compatibility = output.compatibility;

  if (compatibility?.voltageCompatible === false) {
    warnings.push({
      code: GENERATOR_WARNING_CODES.VOLTAGE_MISMATCH,
      severity: "WARNING",
      message:
        "Supplied generator voltage does not satisfy the required generator voltage.",
      path: "generator.voltageV",
      metadata: {
        extras: {
          requiredVoltageV: input.electrical?.requiredVoltageV,
          generatorVoltageV: input.generator?.voltageV,
        },
      },
    });
  }

  if (compatibility?.frequencyCompatible === false) {
    warnings.push({
      code: GENERATOR_WARNING_CODES.FREQUENCY_MISMATCH,
      severity: "WARNING",
      message:
        "Supplied generator frequency does not satisfy the required generator frequency.",
      path: "generator.frequencyHz",
      metadata: {
        extras: {
          requiredFrequencyHz:
            input.electrical?.requiredFrequencyHz,
          generatorFrequencyHz:
            input.generator?.frequencyHz,
        },
      },
    });
  }

  if (compatibility?.phaseCompatible === false) {
    warnings.push({
      code: GENERATOR_WARNING_CODES.PHASE_MISMATCH,
      severity: "WARNING",
      message:
        "Supplied generator phase does not satisfy the required generator phase.",
      path: "generator.phase",
      metadata: {
        extras: {
          requiredPhase: input.electrical?.requiredPhase,
          generatorPhase: input.generator?.phase,
        },
      },
    });
  }

  return warnings;
}