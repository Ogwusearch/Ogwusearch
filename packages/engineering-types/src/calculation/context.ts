// ============================================================
// @ogwusearch/engineering-types
// Calculation Context
// ============================================================

import type { EngineeringId } from "../common/identifier.js";
import type { EngineeringMetadata } from "../common/metadata.js";

/**
 * Context supplied to an engineering calculation.
 *
 * The context contains execution-level information used for
 * identification, reproducibility, tracing, and configuration.
 *
 * Validation issues, assumptions, and trace steps are managed
 * separately by engineering-core.
 */
export interface CalculationContext {
  /**
   * Unique identifier for the calculation execution.
   */
  readonly calculationId: EngineeringId;

  /**
   * Optional identifier for the project or system being calculated.
   */
  readonly projectId?: EngineeringId;

  /**
   * Optional identifier for the calculation run.
   */
  readonly runId?: EngineeringId;

  /**
   * ISO 8601 timestamp indicating when the calculation started.
   */
  readonly startedAt: string;

  /**
   * Optional engineering metadata associated with the calculation.
   */
  readonly metadata?: EngineeringMetadata;

  /**
   * Optional calculation configuration.
   *
   * Domain-specific configuration remains outside the
   * foundation type system.
   */
  readonly options?: Readonly<Record<string, unknown>>;
}
