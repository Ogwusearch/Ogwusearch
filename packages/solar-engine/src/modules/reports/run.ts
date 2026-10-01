import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  ReportsInput,
  ReportsOutput,
} from "./types/index.js";

import {
  validateReports,
} from "./validation/index.js";

import {
  createReportsAssumptions,
} from "./assumptions/index.js";

import {
  buildReport,
} from "./calculation/index.js";

import {
  createReportsTrace,
} from "./trace/index.js";

export function runReports(
  input: ReportsInput,
): CalculationResult<ReportsOutput> {
  const definition =
    defineCalculation<
      ReportsInput,
      ReportsOutput
    >({
      name: "Engineering Report",

      validate(
        value,
      ): EngineeringIssue[] {
        return validateReports(value);
      },

      assumptions: () =>
        createReportsAssumptions(),

      calculate: (
        value,
        context,
      ): ReportsOutput => {
        const output =
          buildReport(value);

        const trace =
          createReportsTrace(output);

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
  );
}
