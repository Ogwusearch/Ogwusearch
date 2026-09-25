
// ============================================================
// Solar Engine
// Load Audit Assumptions
// ============================================================

import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

export function createLoadAssumptions(
  designMargin: number,
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
  ];
}
