import type { EngineeringAssumption } from
  "@ogwusearch/engineering-types";

import type { EarthingInput } from "../types/index.js";

export function createEarthingAssumptions(
  input: EarthingInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [];

  if (input.design?.designMargin !== undefined) {
    assumptions.push({
      code: "EARTHING_DESIGN_MARGIN",
      name: "Earthing Design Margin",
      value: input.design.designMargin,
      description:
        "Earth-conductor sizing uses the explicitly supplied design margin.",
    });
  }

  if (
    input.design?.bondingConductorFactor !==
    undefined
  ) {
    assumptions.push({
      code: "EARTHING_BONDING_FACTOR",
      name: "Bonding Conductor Factor",
      value: input.design.bondingConductorFactor,
      description:
        "Bonding-conductor sizing uses the explicitly supplied bonding factor.",
    });
  }

  if (
    input.design?.earthResistanceTargetOhm !==
    undefined
  ) {
    assumptions.push({
      code: "EARTH_RESISTANCE_TARGET",
      name: "Earth Resistance Target",
      value: input.design.earthResistanceTargetOhm,
      unit: "Ω",
      description:
        "Earth-resistance verification uses the explicitly supplied target.",
    });
  }

  if (input.electrical.resistivityOhmM !== undefined) {
    assumptions.push({
      code: "EARTH_RESISTIVITY",
      name: "Soil Resistivity",
      value: input.electrical.resistivityOhmM,
      unit: "Ω·m",
      description:
        "Earth-resistance calculation uses the supplied soil resistivity.",
    });
  }

  if (input.electrical.electrodeLengthM !== undefined) {
    assumptions.push({
      code: "EARTH_ELECTRODE_LENGTH",
      name: "Earth Electrode Length",
      value: input.electrical.electrodeLengthM,
      unit: "m",
      description:
        "Earth-resistance calculation uses the supplied electrode length.",
    });
  }

  return assumptions;
}