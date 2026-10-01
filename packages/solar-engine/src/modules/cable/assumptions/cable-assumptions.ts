import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

import type {
  CableInput,
} from "../types/index.js";

export function createCableAssumptions(
  input: CableInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [
    {
      code: "CABLE_DESIGN_MARGIN",
      name: "Cable design margin",
      value: input.designMargin,
      description:
        "Explicit design margin applied to the calculated operating current.",
    },
    {
      code: "CABLE_CONDUCTOR_MATERIAL",
      name: "Cable conductor material",
      value: input.conductorMaterial,
      description:
        "Explicit conductor material supplied by the cable sizing input.",
    },
    {
      code: "CABLE_ALLOWABLE_AMPACITY",
      name: "Cable allowable ampacity basis",
      value: input.conductorOptions,
      description:
        "Explicit conductor options used to deterministically select the smallest conductor satisfying the required ampacity.",
    },
  ];

  if (
    input.resistivityOhmMm2PerM !==
    undefined
  ) {
    assumptions.push({
      code: "CABLE_RESISTIVITY",
      name: "Cable conductor resistivity",
      value: input.resistivityOhmMm2PerM,
      unit: "Ω·mm²/m",
      description:
        "Explicit conductor resistivity supplied by the cable input.",
    });
  }

  if (
    input.installationMethod !==
    undefined
  ) {
    assumptions.push({
      code: "CABLE_INSTALLATION_METHOD",
      name: "Cable installation method",
      value: input.installationMethod,
      description:
        "Explicit installation method supplied by the cable input.",
    });
  }

  return assumptions;
}