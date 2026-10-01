import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  SystemValidationInput,
  SystemValidationOutput,
} from "../types/index.js";

import {
  validateCompleteness,
} from "./validate-completeness.js";

import {
  validateCompatibility,
} from "./validate-compatibility.js";

export function validateSystemConfiguration(
  input: SystemValidationInput,
): SystemValidationOutput {
  const checks = [
    ...validateCompleteness(input),
    ...validateCompatibility(input),
  ];

  const issues: EngineeringIssue[] =
    checks
      .filter(
        (check) =>
          check.status === "FAIL",
      )
      .map((check) => ({
        code: check.code,
        severity: "ERROR" as const,
        message: check.message,
        expected: check.expected,
        actual: check.actual,
      }));

  const failedCheckCount =
    checks.filter(
      (check) =>
        check.status === "FAIL",
    ).length;

  const warningCheckCount =
    checks.filter(
      (check) =>
        check.status === "WARNING",
    ).length;

  return {
    valid: failedCheckCount === 0,
    checks,
    issues,
    evaluatedResultCount:
      [
        input.peakDemand,
        input.pvArray,
        input.inverter,
        input.battery,
        input.chargeController,
        input.cable,
        input.voltageDrop,
        input.protection,
        ...(input.additionalResults ?? []),
      ].filter(Boolean).length,
    failedCheckCount,
    warningCheckCount,
  };
}