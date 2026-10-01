import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import {
  createGeneratorAssumptions,
} from "./assumptions/index.js";

import {
  calculateGenerator,
} from "./calculation/index.js";

import {
  createGeneratorWarnings,
} from "./warnings.js";

import {
  createGeneratorTrace,
} from "./trace/index.js";

import {
  validateGenerator,
} from "./validation/index.js";

import type {
  GeneratorInput,
  GeneratorOutput,
} from "./types/index.js";

/**
 * Run Generator sizing and verification.
 */
export function runGenerator(
  input: GeneratorInput,
): CalculationResult<GeneratorOutput> {
  const definition = defineCalculation<
    GeneratorInput,
    GeneratorOutput
  >({
    name: "Generator Sizing",

    validate(value): EngineeringIssue[] {
      return validateGenerator(value);
    },

    assumptions: (value) =>
      createGeneratorAssumptions(value),

    calculate: (value, context): GeneratorOutput => {
      const output =
        calculateGenerator(value);

      const trace =
        createGeneratorTrace(
          value,
          output,
        );

      for (const step of trace) {
        context.trace.add(step);
      }

      return output;
    },

    warnings: (
      value,
      output,
    ) =>
      createGeneratorWarnings(
        value,
        output,
      ),
  });

  return executeCalculation(
    definition,
    input,
  );
}