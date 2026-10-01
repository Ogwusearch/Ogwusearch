import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

import type {
  GeneratorInput,
} from "../types/index.js";

/**
 * Create Generator calculation assumptions.
 *
 * Only explicitly consumed assumptions are returned.
 * No hidden generator efficiency, reserve, starting, fuel,
 * runtime, or dispatch assumptions are introduced.
 */
export function createGeneratorAssumptions(
  input: GeneratorInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [];

  if (input.design?.powerFactor !== undefined) {
    assumptions.push({
      code: "GENERATOR_POWER_FACTOR",
      name: "Generator Power Factor",
      value: input.design.powerFactor,
      description:
        "Explicit power factor used when deriving apparent power.",
    });
  } else if (
    input.requirement.requiredApparentPowerVA === undefined &&
    input.generator?.powerFactor !== undefined
  ) {
    assumptions.push({
      code: "GENERATOR_POWER_FACTOR",
      name: "Generator Power Factor",
      value: input.generator.powerFactor,
      description:
        "Generator power factor used when deriving apparent power because upstream apparent power was not supplied.",
    });
  } else if (
    input.requirement.requiredApparentPowerVA === undefined
  ) {
    assumptions.push({
      code: "GENERATOR_DEFAULT_POWER_FACTOR",
      name: "Generator Default Power Factor",
      value: 1,
      description:
        "Default unity power factor used only because no apparent power or explicit power factor was supplied.",
    });
  }

  if (input.design?.designMargin !== undefined) {
    assumptions.push({
      code: "GENERATOR_DESIGN_MARGIN",
      name: "Generator Design Margin",
      value: input.design.designMargin,
      description:
        "Explicit generator-specific design margin applied to apparent power.",
    });
  }

  return assumptions;
}