import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

/**
 * System validation introduces no hidden engineering assumptions.
 *
 * Validation limits must originate from supplied authoritative
 * results or explicit future system-validation configuration.
 */
export function createSystemValidationAssumptions(): EngineeringAssumption[] {
  return [];
}