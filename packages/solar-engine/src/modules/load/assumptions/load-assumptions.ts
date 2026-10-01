// ============================================================
// Solar Engine
// Load Audit Assumptions
// ============================================================

import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

export function createLoadAssumptions(
  designMargin: number,
  diversityFactor: number,
): EngineeringAssumption[] {
  return [
    {
      code: "LOAD_DESIGN_MARGIN",
      name: "Load Design Margin",
      value: designMargin,
      unit: "ratio",
      description:
        "Additional capacity applied to calculated peak demand.",
    },
    {
      code: "LOAD_DIVERSITY_FACTOR",
      name: "Load Diversity Factor",
      value: diversityFactor,
      unit: "ratio",
      description:
        "Aggregate diversity factor supplied to Peak Demand.",
    },
  ];
}
