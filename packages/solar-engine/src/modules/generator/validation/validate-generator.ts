import type { EngineeringIssue } from "@ogwusearch/engineering-types";

import type { GeneratorInput } from "../types/index.js";

import {
  validateDesignMargin,
  validateGeneratorCapacity,
  validateGeneratorFrequency,
  validateGeneratorPhase,
  validateGeneratorVoltage,
  validatePowerFactor,
  validateRequiredApparentPower,
  validateRequiredFrequency,
  validateRequiredPhase,
  validateRequiredPower,
  validateRequiredVoltage,
  validateStartingDemand,
} from "./rules.js";

/**
 * Validate Generator input.
 *
 * Validation is deliberately limited to the Generator contract.
 *
 * This function does not:
 * - calculate generator capacity
 * - reconstruct peak demand
 * - apply hidden design margins
 * - invent starting requirements
 * - apply efficiency assumptions
 * - select commercial generator products
 */
export function validateGenerator(
  input: GeneratorInput,
): EngineeringIssue[] {
  if (input === null || typeof input !== "object") {
    return [
      {
        code: "INVALID_GENERATOR_INPUT",
        severity: "ERROR",
        message: "Generator input must be an object.",
        path: "input",
        actual: input,
      },
    ];
  }

  const issues: EngineeringIssue[] = [];

  issues.push(...validateRequiredPower(input));
  issues.push(...validateRequiredApparentPower(input));
  issues.push(...validateStartingDemand(input));

  issues.push(...validateGeneratorCapacity(input));
  issues.push(...validatePowerFactor(input));
  issues.push(...validateDesignMargin(input));

  issues.push(...validateGeneratorVoltage(input));
  issues.push(...validateGeneratorFrequency(input));
  issues.push(...validateGeneratorPhase(input));

  issues.push(...validateRequiredVoltage(input));
  issues.push(...validateRequiredFrequency(input));
  issues.push(...validateRequiredPhase(input));

  return issues;
}