import type {
  CalculationOutput,
  CalculationResult,
} from "@ogwusearch/engineering-types";

export function createResult<
  T extends CalculationOutput,
>(
  result: CalculationResult<T>,
): CalculationResult<T> {
  return result;
}
