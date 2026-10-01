import {
  executeCalculation,
  defineCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  EnergyInput,
  EnergyOutput,
} from "./types/index.js";

import {
  validateEnergy,
} from "./validation/index.js";

import {
  calculateEnergy,
} from "./calculation.js";

import {
  createEnergyAssumptions,
} from "./assumptions/index.js";

// ============================================================
// Energy Analysis Runner
// ============================================================

export function runEnergyAnalysis(
  input: EnergyInput,
): CalculationResult<EnergyOutput> {
  const definition = defineCalculation<
    EnergyInput,
    EnergyOutput
  >({
    name: "Energy Analysis",

    validate(
      value,
    ): EngineeringIssue[] {
      return validateEnergy(value);
    },

    assumptions: (value) =>
      createEnergyAssumptions(
        value.systemLossFactor ?? 0,
        value.designMargin ?? 0,
      ),

    calculate: calculateEnergy,
  });

  return executeCalculation(
    definition,
    input,
  );
}
