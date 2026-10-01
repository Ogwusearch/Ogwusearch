import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  CostingInput,
  CostingOutput,
} from "./types/index.js";

import {
  validateCostingInput,
} from "./validation/index.js";

import {
  createCostingAssumptions,
} from "./assumptions/index.js";

import {
  createCostingWarnings,
} from "./warnings.js";

import {
  calculateCosting,
} from "./calculation/index.js";

export function runCosting(
  input: CostingInput,
): CalculationResult<CostingOutput> {
  const definition = defineCalculation<
    CostingInput,
    CostingOutput
  >({
    name: "Costing",

    validate(
      value,
    ): EngineeringIssue[] {
      return validateCostingInput(value);
    },

    assumptions: (value) =>
      createCostingAssumptions(value),

    calculate: calculateCosting,

    warnings: (value, output) =>
      createCostingWarnings(value, output),
  });

  return executeCalculation(
    definition,
    input,
  );
}
