import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export function addTraceStep(
  steps: CalculationTraceStep[],
  step: CalculationTraceStep,
): void {
  steps.push(step);
}
