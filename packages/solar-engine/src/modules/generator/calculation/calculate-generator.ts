import type {
  GeneratorInput,
  GeneratorOutput,
  GeneratorCompatibility,
} from "../types/index.js";

import {
  calculateCapacityMargin,
} from "./calculate-capacity-margin.js";

import {
  calculateGeneratorCapacity,
} from "./calculate-generator-capacity.js";

/**
 * Calculate complete Generator output.
 *
 * This function does not select or modify a commercial generator.
 * When a generator rating is supplied, it is verified against the
 * calculated requirement.
 */
export function calculateGenerator(
  input: GeneratorInput,
): GeneratorOutput {
  const capacity =
    calculateGeneratorCapacity(input);

  const generator =
    input.generator;

  let capacityMargin:
    GeneratorOutput["capacityMargin"];

  let compatibility:
    GeneratorCompatibility | undefined;

  if (generator !== undefined) {
    capacityMargin =
      calculateCapacityMargin(
        generator.capacityVA,
        capacity.requiredApparentPowerVA,
      );

    compatibility = {
      capacityCompatible:
        generator.capacityVA >=
        capacity.requiredApparentPowerVA,
    };

    if (
      input.electrical?.requiredVoltageV !== undefined &&
      generator.voltageV !== undefined
    ) {
      compatibility = {
        ...compatibility,
        voltageCompatible:
          generator.voltageV >=
          input.electrical.requiredVoltageV,
      };
    }

    if (
      input.electrical?.requiredFrequencyHz !== undefined &&
      generator.frequencyHz !== undefined
    ) {
      compatibility = {
        ...compatibility,
        frequencyCompatible:
          generator.frequencyHz ===
          input.electrical.requiredFrequencyHz,
      };
    }

    if (
      input.electrical?.requiredPhase !== undefined &&
      generator.phase !== undefined
    ) {
      compatibility = {
        ...compatibility,
        phaseCompatible:
          generator.phase ===
          input.electrical.requiredPhase,
      };
    }

    if (
      capacity.powerFactor !== undefined &&
      generator.powerFactor !== undefined
    ) {
      compatibility = {
        ...compatibility,
        powerFactorCompatible:
          generator.powerFactor >=
          capacity.powerFactor,
      };
    }
  }

  return {
    requirement:
      input.requirement,

    capacity,

    ...(capacityMargin === undefined
      ? {}
      : { capacityMargin }),

    ...(generator === undefined
      ? {}
      : {
          generatorCapacityVA:
            generator.capacityVA,
          generatorVoltageV:
            generator.voltageV,
          generatorFrequencyHz:
            generator.frequencyHz,
          generatorPhase:
            generator.phase,
        }),

    ...(compatibility === undefined
      ? {}
      : { compatibility }),
  };
}