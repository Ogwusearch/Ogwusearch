import type { CalculationTrace } from "./trace";

export interface CalculationOutput<T> {
  value: T;
  trace: CalculationTrace;
}