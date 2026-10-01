import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import type {
  SystemValidationInput,
  SystemValidationOutput,
} from "./types/index.js";

import {
  validateSystem,
} from "./validation/index.js";

import {
  createSystemValidationAssumptions,
} from "./assumptions/index.js";

import {
  validateSystemConfiguration,
} from "./calculation/index.js";

import {
  createSystemValidationTrace,
} from "./trace/index.js";

import {
  createSystemValidationWarnings,
} from "./warnings.js";

export function runSystemValidation(
  input: SystemValidationInput,
): CalculationResult<SystemValidationOutput> {
  const definition =
    defineCalculation<
      SystemValidationInput,
      SystemValidationOutput
    >({
      name: "System Validation",

      validate(
        value,
      ): EngineeringIssue[] {
        return validateSystem(value);
      },

      assumptions: () =>
        createSystemValidationAssumptions(),

      warnings: (
        _value,
        output,
      ): EngineeringWarning[] =>
        createSystemValidationWarnings(
          output,
        ),

      calculate: (
        value,
        context,
      ): SystemValidationOutput => {
        const output =
          validateSystemConfiguration(
            value,
          );

        const trace =
          createSystemValidationTrace(
            output,
          );

        for (
          const step of trace.steps
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
        name: "System Validation",
        extras: {
          engine:
            "system-validation",
          unitSystem: "SI",
        },
      },
    },
  );
}