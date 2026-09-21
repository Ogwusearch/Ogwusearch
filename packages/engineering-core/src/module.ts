
import type {
  CalculationOutput,
  ValidationResult,
} from "@ogwusearch/engineering-types";

export interface EngineeringModule<I, V extends I, O> {
  validate(input: I): ValidationResult;

  calculate(input: V): CalculationOutput<O>;
}
