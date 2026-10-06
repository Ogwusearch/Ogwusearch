import type { CalculationResult } from "@ogwusearch/engineering-types";
import type { LoadAuditOutput } from "@ogwusearch/load-engine";

export interface SolarAuditCalculationResults {
  /**
   * Authoritative composed Load Audit result.
   *
   * The Load Engine Load Audit internally performs:
   * - load characterization
   * - energy analysis
   * - peak demand analysis
   */
  readonly loadAudit: CalculationResult<LoadAuditOutput>;
}
