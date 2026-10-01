import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

/**
 * Reports does not introduce independent engineering assumptions.
 *
 * Authoritative assumptions remain attached to their upstream
 * CalculationResult and are preserved by the reporting layer.
 */
export function createReportsAssumptions(): EngineeringAssumption[] {
  return [];
}
