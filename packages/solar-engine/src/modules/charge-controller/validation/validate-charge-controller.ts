
import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  ValidationResult,
} from "@ogwusearch/engineering-validation";

import type {
  ChargeControllerSizingInput,
} from "../types/index.js";

import {
  validatePVArrayPower,
  validateBatteryVoltage,
  validateControllerEfficiency,
  validateSafetyMargin,
  validatePVArrayVoltages,
  validatePVArrayCurrents,
  validatePVRelationships,
  validateControllerLimits,
  validateMPPTRange,
} from "./rules.js";

export function validateChargeControllerSizingIssues(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  return [
    ...validatePVArrayPower(input),
    ...validateBatteryVoltage(input),
    ...validateControllerEfficiency(input),
    ...validateSafetyMargin(input),
    ...validatePVArrayVoltages(input),
    ...validatePVArrayCurrents(input),
    ...validatePVRelationships(input),
    ...validateControllerLimits(input),
    ...validateMPPTRange(input),
  ];
}

export function validateChargeControllerSizingInput(
  input: ChargeControllerSizingInput,
): ValidationResult {
  const issues =
    validateChargeControllerSizingIssues(
      input,
    );

  const errors =
    issues.filter(
      (issue) =>
        issue.severity === "ERROR",
    );

  const warnings =
    issues.filter(
      (issue) =>
        issue.severity === "WARNING",
    );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    issues,
  };
}
