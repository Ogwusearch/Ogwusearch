import {
  executeCalculation,
  defineCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  BatterySizingInput,
  BatterySizingOutput,
} from "./types/index.js";

import {
  validateBatterySizing,
} from "./validation/index.js";

import {
  calculateBatterySizing,
} from "./calculation/index.js";

import {
  createBatterySizingAssumptions,
} from "./assumptions/index.js";

// ============================================================
// Battery Sizing Runner
// ============================================================

export function runBatterySizing(
  input: BatterySizingInput,
): CalculationResult<BatterySizingOutput> {
  const definition = defineCalculation<
    BatterySizingInput,
    BatterySizingOutput
  >({
    name: "Battery Sizing",

    validate(
      value,
    ): EngineeringIssue[] {
      return validateBatterySizing(value);
    },

    assumptions: (value) =>
      createBatterySizingAssumptions(value),

    calculate: calculateBatterySizing,
  });

  return executeCalculation(
    definition,
    input,
  );
}