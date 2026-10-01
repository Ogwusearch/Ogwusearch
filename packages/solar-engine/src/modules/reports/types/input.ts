import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

export interface ReportsInput {
  readonly reportId?: string;
  readonly title?: string;

  readonly load?: CalculationResult;
  readonly energy?: CalculationResult;
  readonly peakDemand?: CalculationResult;
  readonly pvSizing?: CalculationResult;
  readonly pvArray?: CalculationResult;
  readonly pvString?: CalculationResult;
  readonly battery?: CalculationResult;
  readonly inverter?: CalculationResult;
  readonly chargeController?: CalculationResult;
  readonly cable?: CalculationResult;
  readonly voltageDrop?: CalculationResult;
  readonly protection?: CalculationResult;
  readonly earthing?: CalculationResult;
  readonly generator?: CalculationResult;
  readonly bom?: CalculationResult;
  readonly costing?: CalculationResult;
  readonly systemValidation?: CalculationResult;

  readonly additionalResults?: ReadonlyArray<CalculationResult>;
}
