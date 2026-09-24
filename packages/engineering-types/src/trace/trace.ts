/**
 * Complete trace of an engineering calculation.
 *
 * A trace contains the ordered steps required to explain
 * how an engineering result was produced.
 */
import type { CalculationTraceStep } from "./step.js";

export interface CalculationTrace {
  /**
   * Ordered calculation steps.
   */
  readonly steps: CalculationTraceStep[];
}