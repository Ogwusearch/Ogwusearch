import type { CalculationDefinition } from "./types.js";

export function defineCalculation<TInput, TOutput>(
  definition: CalculationDefinition<TInput, TOutput>,
): CalculationDefinition<TInput, TOutput> {
  if (!definition.name.trim()) {
    throw new Error("Calculation name cannot be empty.");
  }

  if (typeof definition.calculate !== "function") {
    throw new Error(
      `Calculation "${definition.name}" must provide a calculate function.`,
    );
  }

  return definition;
}
