import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  PvArrayInput,
  PvArrayOutput,
} from "./types/index.js";

import {
  validatePvArrayInput,
} from "./validation/index.js";

import {
  calculatePvArray,
} from "./calculation.js";

import {
  createPvArrayAssumptions,
} from "./assumptions/index.js";

export function runPvArray(
  input: PvArrayInput,
): CalculationResult<PvArrayOutput> {
  const definition = defineCalculation<
    PvArrayInput,
    PvArrayOutput
  >({
    name: "PV Array",

    validate(
      value,
    ): EngineeringIssue[] {
      return validatePvArrayInput(value);
    },

    assumptions: () =>
      createPvArrayAssumptions(),

    calculate: calculatePvArray,
  });

  return executeCalculation(
    definition,
    input,
  );
}