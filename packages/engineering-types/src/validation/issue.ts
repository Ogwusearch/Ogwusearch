import type { EngineeringMetadata } from "../common/metadata.js";

/**
 * Severity of an engineering validation issue.
 *
 * ERROR   = calculation/design cannot be considered valid.
 * WARNING = calculation may remain valid but requires attention.
 */
export type IssueSeverity =
  | "ERROR"
  | "WARNING";

/**
 * Base contract for all engineering validation issues.
 */
export interface EngineeringIssue {
  /**
   * Stable machine-readable issue code.
   *
   * Examples:
   * "VALUE_REQUIRED"
   * "PV_VOLTAGE_TOO_HIGH"
   * "HIGH_INVERTER_UTILIZATION"
   */
  readonly code: string;

  /**
   * Severity of the issue.
   */
  readonly severity: IssueSeverity;

  /**
   * Human-readable explanation.
   */
  readonly message: string;

  /**
   * Optional path to the value that caused the issue.
   *
   * Examples:
   * "dailyEnergyWh"
   * "pvString.voc"
   * "battery.nominalVoltage"
   */
  readonly path?: string;

  /**
   * Optional expected value, range, or constraint.
   */
  readonly expected?: unknown;

  /**
   * Actual value that caused the issue.
   */
  readonly actual?: unknown;

  /**
   * Additional structured information.
   */
  readonly metadata?: EngineeringMetadata;
}