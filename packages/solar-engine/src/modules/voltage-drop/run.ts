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
  VoltageDropInput,
  VoltageDropOutput,
} from "./types/index.js";

import {
  validateVoltageDropInput,
} from "./validation/index.js";

import {
  createVoltageDropAssumptions,
} from "./assumptions/index.js";

import {
  calculateVoltageDrop,
} from "./calculation/index.js";

import {
  createVoltageDropWarnings,
} from "./warnings.js";

import {
  createVoltageDropTrace,
} from "./trace/index.js";

const VOLTAGE_DROP_VERSION =
  "1.0.0";

export function runVoltageDrop(
  input: VoltageDropInput,
): CalculationResult<VoltageDropOutput> {
  const definition =
    defineCalculation<
      VoltageDropInput,
      VoltageDropOutput
    >({
      name: "Voltage Drop",

      validate(
        value,
      ): EngineeringIssue[] {
        return validateVoltageDropInput(
          value,
        );
      },

      assumptions: (
        value,
      ) =>
        createVoltageDropAssumptions(
          value,
        ),

      warnings: (
        value,
        output,
      ): EngineeringWarning[] =>
        createVoltageDropWarnings(
          value,
          output,
        ),

      calculate: (
        value,
        context,
      ): VoltageDropOutput => {
        const output =
          calculateVoltageDrop(
            value,
          );

        const trace =
          createVoltageDropTrace(
            value,
            output,
          );

        for (
          const step of trace
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
        version:
          VOLTAGE_DROP_VERSION,
        name: "Voltage Drop",
        extras: {
          engine: "voltage-drop",
          unitSystem: "SI",
        },
      },
    },
  );
}