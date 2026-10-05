
import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationExecutionContext,
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

import {
  createEnergyTrace,
} from "./trace/index.js";

// ============================================================
// Energy Analysis Calculation
// ============================================================

function calculate(
  input: EnergyInput,
  context: CalculationExecutionContext,
): EnergyOutput {
  const output = calculateEnergy(input);

  /*
   * Energy owns the domain-specific trace.
   *
   * engineering-core owns trace lifecycle and collection.
   * createEnergyTrace() owns the Energy-specific trace steps.
   */
  for (const step of createEnergyTrace(input, output)) {
    context.trace.add(step);
  }

  return output;
}

// ============================================================
// Energy Analysis Definition
// ============================================================

const energyCalculation =
  defineCalculation<
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

    calculate,
  });

// ============================================================
// Energy Analysis Runner
// ============================================================

export function runEnergyAnalysis(
  input: EnergyInput,
): CalculationResult<EnergyOutput> {
  return executeCalculation(
    energyCalculation,
    input,
    {
      metadata: {
        extras: {
          module:
            "@ogwusearch/solar-engine/energy",
        },
      },
    },
  );
}
