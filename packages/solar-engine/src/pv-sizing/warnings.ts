import type { ValidationResult } from "@ogwusearch/engineering-validation";

import { PV_SIZING_CONSTANTS } from "./constants.js";
import type {
  PVSizingInput,
  PVSizingValue,
} from "./types/index.js";

/**
 * PV sizing validation warning codes.
 *
 * Warnings indicate conditions that do not invalidate
 * the calculation but may require engineering review.
 */
export const PV_SIZING_WARNING_CODES = {
  LOW_PEAK_SUN_HOURS:
    "PV_SIZING_LOW_PEAK_SUN_HOURS",
} as const;

export type PVSizingWarningCode =
  (typeof PV_SIZING_WARNING_CODES)[keyof typeof PV_SIZING_WARNING_CODES];

/**
 * Generate engineering warnings for PV sizing.
 */
export function generatePVSizingWarnings(
  input: PVSizingInput,
  value: PVSizingValue,
): ValidationResult["warnings"] {
  const warnings: ValidationResult["warnings"] = [];

  const addWarning = (
    code: string,
    message: string,
    field: string,
    value?: unknown,
  ): void => {
    warnings.push({
      code,
      path: field,
      message,
      ...(value !== undefined
        ? {
            metadata: {
              extras: {
                value,
              },
            },
          }
        : {}),
      severity: "WARNING",
    });
  };

  if (
    Number.isFinite(input.peakSunHours) &&
    input.peakSunHours > 0 &&
    input.peakSunHours <
      PV_SIZING_CONSTANTS.lowPeakSunHours
  ) {
    addWarning(
      PV_SIZING_WARNING_CODES.LOW_PEAK_SUN_HOURS,
      `Peak sun hours are below ${PV_SIZING_CONSTANTS.lowPeakSunHours} hours. The calculated PV capacity may be relatively large.`,
      "peakSunHours",
      input.peakSunHours,
    );
  }

  return warnings;
}