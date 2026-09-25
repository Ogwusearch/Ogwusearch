import {
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  PVSizingInput,
  PVSizingOutput,
} from "./types/index.js";

import { validatePVSizingIssues } from "./validation/index.js";
import { createPVSizingAssumptions } from "./assumptions/index.js";
import { calculatePVSizing } from "./calculation/index.js";

export function runPVSizing(
  input: PVSizingInput,
): CalculationResult<PVSizingOutput> {
  return executeCalculation<
    PVSizingInput,
    PVSizingOutput
  >(
    {
      name: "pv-sizing",
      validate: validatePVSizingIssues,
      assumptions: createPVSizingAssumptions,
      calculate: calculatePVSizing,
    },
    input,
  );
}