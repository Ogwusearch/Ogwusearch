import type {
  CalculationTrace,
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export function createPVSizingTrace(
  steps: CalculationTraceStep[],
): CalculationTrace {
  return {
    steps,
  };
}
