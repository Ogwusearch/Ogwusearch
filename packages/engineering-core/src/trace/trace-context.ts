import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export interface TraceContext {
  readonly steps: CalculationTraceStep[];
}

export function createTraceContext(): TraceContext {
  return {
    steps: [],
  };
}

export function addTrace(
  context: TraceContext,
  step: CalculationTraceStep,
): void {
  context.steps.push(step);
}
