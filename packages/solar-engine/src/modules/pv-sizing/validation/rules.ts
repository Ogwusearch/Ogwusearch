// ============================================================
// PV Sizing
// Validation Rules
// ============================================================

import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "@ogwusearch/engineering-validation";

import { PV_SIZING_ERROR_CODES } from "../errors.js";

/**
 * Creates a PV-sizing numeric validation rule.
 *
 * The rule preserves the existing PV-sizing error code and
 * message while conforming to the shared ValidationRule<T>
 * contract.
 */
function finiteNumberRule(
  code: string,
  message: string,
): ValidationRule<unknown> {
  return {
    code,
    description: message,

    check(
      value: unknown,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value)
      ) {
        return [
          {
            code,
            severity: "ERROR",
            message,
            ...(context.path !== undefined && {
              path: context.path,
            }),
            metadata: {
              extras: {
                actual: value,
              },
            },
          },
        ];
      }

      return [];
    },
  };
}

/**
 * Creates a PV-sizing positive-number validation rule.
 */
function positiveNumberRule(
  code: string,
  message: string,
): ValidationRule<number> {
  return {
    code,
    description: message,

    check(
      value: number,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (value <= 0) {
        return [
          {
            code,
            severity: "ERROR",
            message,
            ...(context.path !== undefined && {
              path: context.path,
            }),
            metadata: {
              extras: {
                actual: value,
              },
            },
          },
        ];
      }

      return [];
    },
  };
}

/**
 * Creates a PV-sizing system-efficiency validation rule.
 *
 * Existing behavior:
 *   0 < systemEfficiency <= 1
 */
function systemEfficiencyRangeRule(
  code: string,
  message: string,
): ValidationRule<number> {
  return {
    code,
    description: message,

    check(
      value: number,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (
        value <= 0 ||
        value > 1
      ) {
        return [
          {
            code,
            severity: "ERROR",
            message,
            ...(context.path !== undefined && {
              path: context.path,
            }),
            metadata: {
              extras: {
                minimumExclusive: 0,
                maximumInclusive: 1,
                actual: value,
              },
            },
          },
        ];
      }

      return [];
    },
  };
}

// ------------------------------------------------------------
// Daily Energy
// ------------------------------------------------------------

export const dailyEnergyNumericRule =
  finiteNumberRule(
    PV_SIZING_ERROR_CODES.INVALID_DAILY_ENERGY,
    "Daily energy must be a finite number.",
  );

export const dailyEnergyPositiveRule =
  positiveNumberRule(
    PV_SIZING_ERROR_CODES.INVALID_DAILY_ENERGY,
    "Daily energy must be greater than zero.",
  );

// ------------------------------------------------------------
// Peak Sun Hours
// ------------------------------------------------------------

export const peakSunHoursNumericRule =
  finiteNumberRule(
    PV_SIZING_ERROR_CODES.INVALID_PEAK_SUN_HOURS,
    "Peak sun hours must be a finite number.",
  );

export const peakSunHoursPositiveRule =
  positiveNumberRule(
    PV_SIZING_ERROR_CODES.INVALID_PEAK_SUN_HOURS,
    "Peak sun hours must be greater than zero.",
  );

// ------------------------------------------------------------
// System Efficiency
// ------------------------------------------------------------

export const systemEfficiencyNumericRule =
  finiteNumberRule(
    PV_SIZING_ERROR_CODES.INVALID_SYSTEM_EFFICIENCY,
    "System efficiency must be a finite number.",
  );

export const systemEfficiencyRangeValidationRule =
  systemEfficiencyRangeRule(
    PV_SIZING_ERROR_CODES.INVALID_SYSTEM_EFFICIENCY,
    "System efficiency must be greater than 0 and less than or equal to 1.",
  );

// ------------------------------------------------------------
// Panel Power
// ------------------------------------------------------------

export const panelPowerNumericRule =
  finiteNumberRule(
    PV_SIZING_ERROR_CODES.INVALID_PANEL_POWER,
    "Panel power must be a finite number.",
  );

export const panelPowerPositiveRule =
  positiveNumberRule(
    PV_SIZING_ERROR_CODES.INVALID_PANEL_POWER,
    "Panel power must be greater than zero.",
  );