import type {
  EngineeringResult,
  ValidationResult,
  CalculationOutput,
} from "../../engineering-types/src";

export interface EngineeringModule<I, V, O> {
  validate(input: I): ValidationResult;

  calculate(input: V): CalculationOutput<O>;

  run(input: I): EngineeringResult<O>;
}