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
  EngineeringMessage,
  InverterSizingInput,
  InverterSizingValue,
} from "./types/index.js";

import {
  validateInverterSizingInput,
} from "./validation/index.js";

import {
  calculateInverterSizing,
} from "./calculation/index.js";

import {
  generateInverterSizingWarnings,
} from "./warnings.js";

import {
  createInverterSizingAssumptions,
} from "./assumptions/index.js";

import {
  appendInverterSizingTrace,
} from "./trace/index.js";

const INVERTER_SIZING_VERSION =
  "1.0.0";

function toEngineeringIssue(
  message: EngineeringMessage,
  severity: "ERROR" | "WARNING",
): EngineeringIssue {
  return {
    code: message.code,
    severity,
    message: message.message,

    ...(message.field !== undefined && {
      path: message.field,
    }),

    ...(message.value !== undefined && {
      actual: message.value,
    }),
  };
}

function toEngineeringError(
  message: EngineeringMessage,
): EngineeringError {
  return {
    ...toEngineeringIssue(
      message,
      "ERROR",
    ),
    severity: "ERROR",
  };
}

function toEngineeringWarning(
  message: EngineeringMessage,
): EngineeringWarning {
  return {
    ...toEngineeringIssue(
      message,
      "WARNING",
    ),
    severity: "WARNING",
  };
}

export function runInverterSizing(
  input: InverterSizingInput,
): CalculationResult<InverterSizingValue> {
  const definition =
    defineCalculation<
      InverterSizingInput,
      InverterSizingValue
    >({
      name: "Inverter Sizing",

      validate(
        value,
      ): EngineeringIssue[] {
        return validateInverterSizingInput(
          value,
        ).map(toEngineeringError);
      },

      assumptions: (value) =>
        createInverterSizingAssumptions(
          value,
        ),

      warnings: (
        value,
        output,
      ): EngineeringWarning[] =>
        generateInverterSizingWarnings(
          value,
          output,
        ).map(toEngineeringWarning),

      calculate: (
        value,
        context,
      ): InverterSizingValue => {
        const result =
          calculateInverterSizing(
            value,
          );

        appendInverterSizingTrace(
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
          INVERTER_SIZING_VERSION,
        name: "Inverter Sizing",
        extras: {
          engine: "inverter-sizing",
          unitSystem: "SI",
        },
      },
    },
  );
}