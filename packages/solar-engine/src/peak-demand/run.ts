import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import {
  PEAK_DEMAND_DEFAULTS,
} from "./constants.js";

import {
  createPeakDemandAssumptions,
} from "./assumptions/index.js";

import {
  calculatePeakDemand,
} from "./calculation/index.js";

import {
  validatePeakDemandInput,
} from "./validation/index.js";

import type {
  PeakDemandInput,
  PeakDemandOutput,
} from "./types/index.js";

export function runPeakDemand(
  input: PeakDemandInput,
): CalculationResult<PeakDemandOutput> {
  const definition = defineCalculation<
    PeakDemandInput,
    PeakDemandOutput
  >({
    name: "Peak Demand",

    validate(value) {
      return validatePeakDemandInput(value);
    },

    assumptions(value) {
      return createPeakDemandAssumptions(
        value.diversityFactor ??
          PEAK_DEMAND_DEFAULTS.diversityFactor,
        value.demandMargin ??
          PEAK_DEMAND_DEFAULTS.demandMargin,
      );
    },

    calculate: calculatePeakDemand,
  });

  return executeCalculation(
    definition,
    input,
  );
}
