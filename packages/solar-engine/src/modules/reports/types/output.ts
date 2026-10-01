import type {
  CalculationOutput,
  CalculationResult,
  EngineeringAssumption,
  EngineeringError,
  EngineeringMetadata,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

export interface ReportSection<
  TOutput extends CalculationOutput = CalculationOutput,
> {
  readonly id: string;
  readonly title: string;
  readonly result: CalculationResult<TOutput>;
}

export interface ReportsOutput extends CalculationOutput {
  readonly reportId?: string;
  readonly title?: string;

  readonly sections: ReadonlyArray<ReportSection>;

  readonly results: ReadonlyArray<CalculationResult>;

  readonly assumptions: ReadonlyArray<EngineeringAssumption>;
  readonly warnings: ReadonlyArray<EngineeringWarning>;
  readonly errors: ReadonlyArray<EngineeringError>;

  readonly metadata?: EngineeringMetadata;
}
