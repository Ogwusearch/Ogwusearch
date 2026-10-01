import type {
  CalculationTrace,
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

/**
 * Create the calculation trace for a PV string calculation.
 *
 * Trace construction remains owned by the shared engineering
 * calculation lifecycle. This helper only packages the supplied
 * domain-specific trace steps.
 */
export function createPvStringTrace(
  steps: CalculationTraceStep[],
): CalculationTrace {
  return {
    steps,
  };
}
