import {
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  PvStringInput,
  PvStringOutput,
} from "./types/index.js";

import {
  validatePvStringIssues,
} from "./validation/index.js";

import {
  createPvStringAssumptions,
} from "./assumptions/index.js";

import {
  calculatePvString,
} from "./calculation/index.js";

export function runPvString(
  input: PvStringInput,
): CalculationResult<PvStringOutput> {
  return executeCalculation<
    PvStringInput,
    PvStringOutput
  >(
    {
      name: "pv-string",
      validate: validatePvStringIssues,
      assumptions: createPvStringAssumptions,
      calculate: calculatePvString,
    },
    input,
  );
}
