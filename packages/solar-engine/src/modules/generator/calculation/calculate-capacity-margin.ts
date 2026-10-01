import type {
  GeneratorCapacityMargin,
} from "../types/index.js";

/**
 * Calculate generator capacity margin.
 *
 * margin = generator capacity - required capacity
 *
 * utilization = required capacity / generator capacity
 *
 * marginFraction =
 *   (generator capacity - required capacity) / required capacity
 */
export function calculateCapacityMargin(
  generatorCapacityVA: number,
  requiredCapacityVA: number,
): GeneratorCapacityMargin {
  const marginVA =
    generatorCapacityVA - requiredCapacityVA;

  const marginFraction =
    marginVA / requiredCapacityVA;

  const utilization =
    requiredCapacityVA / generatorCapacityVA;

  return {
    generatorCapacityVA,
    requiredCapacityVA,
    marginVA,
    marginFraction,
    utilization,
  };
}