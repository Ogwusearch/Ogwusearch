import type {
  CalculationContext as SharedCalculationContext,
  CalculationResult,
  CalculationStatus,
  EngineeringAssumption,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

export type {
  CalculationResult,
  CalculationStatus,
  EngineeringAssumption,
};

export type CalculationContext = SharedCalculationContext;

export interface CalculationDefinition<TInput, TOutput> {
  readonly name: string;

  readonly validate?: (
    input: TInput,
  ) => EngineeringIssue[];

  readonly assumptions?:
    | EngineeringAssumption[]
    | ((
        input: TInput,
      ) => EngineeringAssumption[]);

  readonly calculate: (
    input: TInput,
    context: CalculationContext,
  ) => TOutput;
}