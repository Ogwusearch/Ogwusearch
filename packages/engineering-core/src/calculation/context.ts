// ============================================================
// @ogwusearch/engineering-core
// Calculation Context
// ============================================================

import type {
  CalculationContext as SharedCalculationContext,
  EngineeringId,
} from "@ogwusearch/engineering-types";

/**
 * Creates the execution context supplied to an engineering
 * calculation.
 *
 * The shared CalculationContext type lives in
 * @ogwusearch/engineering-types.
 */
export function createCalculationContext(
  calculationId?: EngineeringId,
): SharedCalculationContext {
  return {
    calculationId:
      calculationId ??
      `calc_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`,
    startedAt: new Date().toISOString(),
  };
}
