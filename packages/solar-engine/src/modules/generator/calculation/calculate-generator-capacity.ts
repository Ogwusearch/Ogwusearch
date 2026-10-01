import type {
  GeneratorInput,
  GeneratorCapacity,
} from "../types/index.js";

import {
  calculateApparentPower,
} from "./calculate-apparent-power.js";

/**
 * Calculate the generator capacity requirement.
 *
 * Generator-specific design margin is applied only when explicitly
 * supplied through input.design.designMargin.
 *
 * No generator-specific margin is silently introduced.
 *
 * required capacity:
 *
 *     S_required = S × (1 + designMargin)
 *
 * When no generator-specific design margin is supplied:
 *
 *     S_required = S
 */
export function calculateGeneratorCapacity(
  input: GeneratorInput,
): GeneratorCapacity {
  const apparentPowerVA =
    calculateApparentPower(input);

  const designMargin =
    input.design?.designMargin;

  const requiredApparentPowerVA =
    designMargin === undefined
      ? apparentPowerVA
      : apparentPowerVA * (1 + designMargin);

  return {
    requiredPowerW:
      input.requirement.requiredPowerW,

    requiredApparentPowerVA,

    ...(designMargin === undefined
      ? {}
      : { designMargin }),

    ...(input.design?.powerFactor !== undefined
      ? {
          powerFactor:
            input.design.powerFactor,
        }
      : input.generator?.powerFactor !== undefined
        ? {
            powerFactor:
              input.generator.powerFactor,
          }
        : {}),
  };
}