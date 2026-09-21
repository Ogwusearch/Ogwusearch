import type { ValidationResult } from "@ogwusearch/engineering-validation";

import type { PvStringInput } from "./types";

/**
 * PV string validation warning codes.
 *
 * Warnings indicate conditions that do not invalidate
 * the calculation but may require engineering review.
 */
export const PV_STRING_WARNING_CODES = {
  SINGLE_MODULE_STRING:
    "PV_STRING_SINGLE_MODULE_STRING",
} as const;

export type PvStringWarningCode =
  (typeof PV_STRING_WARNING_CODES)[keyof typeof PV_STRING_WARNING_CODES];

/**
 * Generate engineering warnings for PV string sizing.
 */
export function generatePvStringWarnings(
  input: PvStringInput,
): ValidationResult["warnings"] {
  const warnings: ValidationResult["warnings"] = [];

  if (input.modulesPerString === 1) {
    warnings.push({
      code: PV_STRING_WARNING_CODES.SINGLE_MODULE_STRING,
      field: "modulesPerString",
      message: "The PV string uses only one module.",
      value: input.modulesPerString,
      severity: "warning",
    });
  }

  return warnings;
}