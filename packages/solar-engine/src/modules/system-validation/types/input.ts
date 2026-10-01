import type { CalculationResult } from "@ogwusearch/engineering-types";

export interface SystemValidationInput {
  readonly peakDemand?: CalculationResult;
  readonly pvArray?: CalculationResult;
  readonly inverter?: CalculationResult;
  readonly battery?: CalculationResult;
  readonly chargeController?: CalculationResult;
  readonly cable?: CalculationResult;
  readonly voltageDrop?: CalculationResult;
  readonly protection?: CalculationResult;

  readonly additionalResults?: ReadonlyArray<CalculationResult>;
}