// ============================================================
// Solar Engine
// Energy Analysis Assumptions
// ============================================================

import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

export function createEnergyAssumptions(
  systemLossFactor: number,
  designMargin: number,
): EngineeringAssumption[] {
  return [
    {
      code: "ENERGY_SYSTEM_LOSS_FACTOR",
      name: "Energy System Loss Factor",
      value: systemLossFactor,
      unit: "ratio",
      description:
        "Fraction of supplied energy lost by the system during energy analysis.",
      source: "Design input",
    },
    {
      code: "ENERGY_DESIGN_MARGIN",
      name: "Energy Design Margin",
      value: designMargin,
      unit: "ratio",
      description:
        "Additional energy capacity applied after system loss adjustment.",
      source: "Design input",
    },
  ];
}