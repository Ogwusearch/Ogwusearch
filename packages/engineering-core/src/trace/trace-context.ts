// ============================================================
// @ogwusearch/engineering-core
// Trace Context
// ============================================================

import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export interface TraceContext {
  readonly steps: CalculationTraceStep[];

  /**
   * Adds a trace step and assigns an execution sequence when
   * one is not explicitly supplied.
   */
  add(step: CalculationTraceStep): void;
}

export function createTraceContext(): TraceContext {
  const steps: CalculationTraceStep[] = [];

  return {
    steps,

    add(step: CalculationTraceStep): void {
      steps.push({
        ...step,
        sequence:
          step.sequence ??
          steps.length + 1,
      });
    },
  };
}

export function addTrace(
  context: TraceContext,
  step: CalculationTraceStep,
): void {
  context.add(step);
}
