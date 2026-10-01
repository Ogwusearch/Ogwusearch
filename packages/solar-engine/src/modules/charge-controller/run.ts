import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringError,
  EngineeringIssue,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "./types/index.js";

import {
  validateChargeControllerSizingIssues,
} from "./validation/index.js";


import {
  calculateChargeControllerSizing,
} from "./calculation/index.js";

import {
  generateChargeControllerSizingWarnings,
} from "./warnings.js";

import {
  createChargeControllerAssumptions,
} from "./assumptions/index.js";

import {
  appendChargeControllerTrace,
} from "./trace/index.js";

const CHARGE_CONTROLLER_SIZING_VERSION =
  "1.0.0";

function toEngineeringError(
  issue: EngineeringIssue,
): EngineeringError {
  return {
    ...issue,
    severity: "ERROR",
  };
}

function toEngineeringWarning(
  issue: {
    readonly code: string;
    readonly field?: string;
    readonly message: string;
    readonly value?: unknown;
  },
): EngineeringWarning {
  return {
    code: issue.code,
    severity: "WARNING",
    message: issue.message,

    ...(issue.field !== undefined && {
      path: issue.field,
    }),

    ...(issue.value !== undefined && {
      actual: issue.value,
    }),
  };
}

export function runChargeControllerSizing(
  input: ChargeControllerSizingInput,
): CalculationResult<ChargeControllerSizingValue> {
  const definition =
    defineCalculation<
      ChargeControllerSizingInput,
      ChargeControllerSizingValue
    >({
      name: "Charge Controller Sizing",

      validate(
        value,
      ): EngineeringIssue[] {
        return validateChargeControllerSizingIssues(
          value,
        ).map(toEngineeringError);
      },

      assumptions: (value) =>
        createChargeControllerAssumptions(
          value,
        ),

      warnings: (
        value,
        output,
      ): EngineeringWarning[] =>
        generateChargeControllerSizingWarnings(
          value,
          output,
        ).map(toEngineeringWarning),

      calculate: (
        value,
        context,
      ): ChargeControllerSizingValue => {
        const result =
          calculateChargeControllerSizing(
            value,
          );

        appendChargeControllerTrace(
          context.trace,
          value,
          result,
        );

        return result;
      },
    });

  return executeCalculation(
    definition,
    input,
    {
      metadata: {
        module:
          "@ogwusearch/solar-engine",

        version:
          CHARGE_CONTROLLER_SIZING_VERSION,

        name:
          "Charge Controller Sizing",

        extras: {
          engine:
            "charge-controller-sizing",

          unitSystem: "SI",
        },
      },
    },
  );
}