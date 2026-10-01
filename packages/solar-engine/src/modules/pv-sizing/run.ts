// ============================================================
// PV Sizing
// Calculation Runner
// ============================================================

import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  PVSizingInput,
  PVSizingOutput,
} from "./types/index.js";

import {
  validatePVSizingIssues,
} from "./validation/index.js";

import {
  createPVSizingAssumptions,
} from "./assumptions/index.js";

import {
  calculatePVSizing,
} from "./calculation/index.js";

// ------------------------------------------------------------
// PV Sizing Calculation Definition
// ------------------------------------------------------------

const pvSizingCalculation =
  defineCalculation<
    PVSizingInput,
    PVSizingOutput
  >({

    name: "pv-sizing",

    validate:
      validatePVSizingIssues,

    assumptions:
      createPVSizingAssumptions,

    calculate:
      calculatePVSizing,

  });


// ------------------------------------------------------------
// PV Sizing Runner
// ------------------------------------------------------------

export function runPVSizing(
  input: PVSizingInput,
): CalculationResult<PVSizingOutput> {

  return executeCalculation(
    pvSizingCalculation,
    input,
  );
}