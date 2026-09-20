/**
 * SolarAudit — Energy Engine
 *
 * Engineering warnings for energy calculations.
 *
 * Warnings are non-fatal conditions.
 * They do not prevent a calculation from returning a result.
 *
 * This module:
 * - Defines warning codes
 * - Defines warning severity
 * - Creates structured warnings
 *
 * This module does NOT:
 * - Perform calculations
 * - Validate inputs
 * - Access databases
 * - Contain UI logic
 */

/**
 * Severity levels for engineering warnings.
 */
export type EnergyWarningSeverity = "INFO" | "WARNING";

/**
 * Known warning codes produced by the Energy Engine.
 */
export type EnergyWarningCode =
  | "LOW_OPERATING_HOURS"
  | "HIGH_OPERATING_HOURS"
  | "HIGH_DAILY_ENERGY"
  | "HIGH_LOAD_CONTRIBUTION"
  | "ZERO_ENERGY_LOAD"
  | "PARTIAL_LOAD_DATA"
  | "UNUSUAL_POWER_VALUE"
  | "UNUSUAL_ENERGY_VALUE";

/**
 * Structured engineering warning.
 */
export interface EnergyWarning {
  code: EnergyWarningCode;
  severity: EnergyWarningSeverity;
  message: string;
  field?: string;
  loadName?: string;
  value?: number;
  unit?: string;
}

/**
 * Creates a structured energy warning.
 */
export function createEnergyWarning(
  warning: EnergyWarning,
): EnergyWarning {
  return warning;
}

/**
 * Creates an informational warning.
 */
export function infoWarning(
  code: EnergyWarningCode,
  message: string,
  details: Omit<EnergyWarning, "code" | "severity" | "message"> = {},
): EnergyWarning {
  return {
    code,
    severity: "INFO",
    message,
    ...details,
  };
}

/**
 * Creates a standard engineering warning.
 */
export function engineeringWarning(
  code: EnergyWarningCode,
  message: string,
  details: Omit<EnergyWarning, "code" | "severity" | "message"> = {},
): EnergyWarning {
  return {
    code,
    severity: "WARNING",
    message,
    ...details,
  };
}