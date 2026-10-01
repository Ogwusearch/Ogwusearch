import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

import type {
  CostingInput,
} from "../types/index.js";

export function createCostingAssumptions(
  input: CostingInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [
    {
      code: "COSTING_CURRENCY",
      name: "Costing Currency",
      value: input.currency,
      description:
        "All supplied monetary values are interpreted using the explicitly supplied currency.",
      source: "costing-input",
      reference: "CostingInput.currency",
    },
    {
      code: "COSTING_UNIT_PRICES",
      name: "Unit Pricing",
      value: "supplied",
      description:
        "Unit costs are supplied economic inputs and are not derived from market data.",
      source: "costing-input",
      reference: "CostItem.unitCost",
    },
  ];

  if (input.contingencyRate !== undefined) {
    assumptions.push({
      code: "COSTING_CONTINGENCY_RATE",
      name: "Contingency Rate",
      value: input.contingencyRate,
      unit: "ratio",
      description:
        "Costing applies the explicitly supplied contingency rate to the calculated subtotal.",
      source: "costing-input",
      reference: "CostingInput.contingencyRate",
    });
  }

  if (input.additionalCosts !== undefined) {
    assumptions.push({
      code: "COSTING_ADDITIONAL_COSTS",
      name: "Additional Costs",
      value: input.additionalCosts,
      unit: input.currency,
      description:
        "Costing includes the explicitly supplied additional costs.",
      source: "costing-input",
      reference: "CostingInput.additionalCosts",
    });
  }

  return assumptions;
}
