import type { CalculationResult } from "@ogwusearch/engineering-types";

export interface BOMInput {
  readonly pv?: CalculationResult;
  readonly battery?: CalculationResult;
  readonly inverter?: CalculationResult;
  readonly chargeController?: CalculationResult;
  readonly cable?: CalculationResult;
  readonly protection?: CalculationResult;
  readonly earthing?: CalculationResult;

  /**
   * Explicitly supplied engineering/component sections
   * that are not yet represented by a dedicated upstream field.
   */
  readonly additionalResults?: ReadonlyArray<CalculationResult>;
}