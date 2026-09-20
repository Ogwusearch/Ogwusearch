import type { CalculationTrace } from "@ogwusearch/engineering-types";

export function createTrace(): CalculationTrace {
  return {
    formulas: [],
    assumptions: [],
    intermediateValues: [],
    constants: [],
    steps: [],
  };
}
