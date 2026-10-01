import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  BOMInput,
  BOMOutput,
} from "./types/index.js";

import {
  validateBOM,
} from "./validation/index.js";

import {
  createBOMAssumptions,
} from "./assumptions/index.js";

import {
  buildBOM,
} from "./calculation/index.js";

export function runBOM(
  input: BOMInput,
): CalculationResult<BOMOutput> {
  const definition =
    defineCalculation<
      BOMInput,
      BOMOutput
    >({
      name: "Bill of Materials",

      validate(
        value,
      ): EngineeringIssue[] {
        return validateBOM(value);
      },

      assumptions: () =>
        createBOMAssumptions(),

      calculate: (
        value,
        context,
      ): BOMOutput => {
        const assumptions =
          createBOMAssumptions();

        const output =
          buildBOM(
            value,
            assumptions,
          );

        for (
          const step of output.trace.steps
        ) {
          context.trace.add(step);
        }

        return output;
      },
    });

  return executeCalculation(
    definition,
    input,
    {
      metadata: {
        module:
          "@ogwusearch/solar-engine",
        version: "1.0.0",
        name: "Bill of Materials",
        extras: {
          engine: "bom",
          unitSystem: "SI",
        },
      },
    },
  );
}
