import type {
  CalculationResult,
  EngineeringAssumption,
  EngineeringError,
  EngineeringIssue,
  EngineeringWarning,
  CalculationOutput,
} from "@ogwusearch/engineering-types";

import { defineCalculation } from "./definition.js";
import { createCalculationContext } from "./context.js";
import type {
  CalculationDefinition,
} from "./types.js";

export function executeCalculation<
  TInput,
  TOutput extends CalculationOutput,
>(
  definition: CalculationDefinition<TInput, TOutput>,
  input: TInput,
): CalculationResult<TOutput> {
  const calculation = defineCalculation(definition);
  const context = createCalculationContext();

  // ----------------------------------------------------------
  // Validation
  // ----------------------------------------------------------

  const validationIssues: EngineeringIssue[] =
    calculation.validate
      ? calculation.validate(input)
      : [];

  const errors: EngineeringError[] =
    validationIssues.filter(
      (issue): issue is EngineeringError =>
        issue.severity === "ERROR",
    );

  const warnings: EngineeringWarning[] =
    validationIssues.filter(
      (issue): issue is EngineeringWarning =>
        issue.severity === "WARNING",
    );

  // ----------------------------------------------------------
  // Assumptions
  // ----------------------------------------------------------

  const assumptions: EngineeringAssumption[] =
    typeof calculation.assumptions === "function"
      ? calculation.assumptions(input)
      : calculation.assumptions
        ? [...calculation.assumptions]
        : [];

  // ----------------------------------------------------------
  // Trace
  // ----------------------------------------------------------

  const trace = {
    steps: [],
  };

  // ----------------------------------------------------------
  // Stop on validation errors
  // ----------------------------------------------------------

  if (errors.length > 0) {
    return {
      status: "ERROR",
      valid: false,
      errors,
      warnings,
      assumptions,
      trace,
      metadata: context.metadata ?? {},
    };
  }

  // ----------------------------------------------------------
  // Calculation
  // ----------------------------------------------------------

  try {
    const value = calculation.calculate(
      input,
      context,
    );

    const status =
      warnings.length > 0
        ? "WARNING"
        : "SUCCESS";

    return {
      status,
      valid: true,
      value,
      errors,
      warnings,
      assumptions,
      trace,
      metadata: context.metadata ?? {},
    };
  } catch (error) {
    const calculationError: EngineeringError = {
      code: "CALCULATION_FAILED",
      severity: "ERROR",
      message:
        error instanceof Error
          ? error.message
          : "Calculation failed.",
    };

    return {
      status: "ERROR",
      valid: false,
      errors: [calculationError],
      warnings,
      assumptions,
      trace,
      metadata: context.metadata ?? {},
    };
  }
}