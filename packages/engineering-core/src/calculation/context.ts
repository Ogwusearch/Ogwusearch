// ============================================================
// @ogwusearch/engineering-core
// Calculation Context
// ============================================================

import type {
  CalculationContext as SharedCalculationContext,
  EngineeringId,
} from "@ogwusearch/engineering-types";

/**
 * Options used to construct an execution context.
 *
 * calculationId should normally be supplied by the caller so
 * execution identity is explicit and traceable.
 *
 * startedAt is operational metadata and therefore intentionally
 * represents execution time rather than calculation input state.
 */
export interface CalculationContextOptions {
  readonly calculationId: EngineeringId;
  readonly projectId?: EngineeringId;
  readonly runId?: EngineeringId;
  readonly startedAt?: string;
  readonly metadata?: SharedCalculationContext["metadata"];
  readonly options?: SharedCalculationContext["options"];
}

/**
 * Creates the shared calculation context.
 */
export function createCalculationContext(
  options: CalculationContextOptions,
): SharedCalculationContext {
  return {
    calculationId: options.calculationId,
    startedAt:
      options.startedAt ??
      new Date().toISOString(),

    ...(options.projectId !== undefined && {
      projectId: options.projectId,
    }),

    ...(options.runId !== undefined && {
      runId: options.runId,
    }),

    ...(options.metadata !== undefined && {
      metadata: options.metadata,
    }),

    ...(options.options !== undefined && {
      options: options.options,
    }),
  };
}
