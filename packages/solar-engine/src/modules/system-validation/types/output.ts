import type {
  CalculationOutput,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

export type SystemValidationCheckStatus =
  | "PASS"
  | "FAIL"
  | "WARNING"
  | "NOT_EVALUATED";

export interface SystemValidationCheck {
  readonly code: string;
  readonly name: string;
  readonly status: SystemValidationCheckStatus;
  readonly actual?: unknown;
  readonly expected?: unknown;
  readonly message: string;
}

export interface SystemValidationOutput
  extends CalculationOutput {
  readonly valid: boolean;

  readonly checks: ReadonlyArray<SystemValidationCheck>;

  readonly issues: ReadonlyArray<EngineeringIssue>;

  readonly evaluatedResultCount: number;

  readonly failedCheckCount: number;

  readonly warningCheckCount: number;
}