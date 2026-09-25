import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type { ValidationResult } from "@ogwusearch/engineering-validation";

import {
  validatePvStringInput,
} from "./validate-pv-string.js";

export { validatePvStringInput } from "./validate-pv-string.js";

export function validatePvStringIssues(
  input: Parameters<typeof validatePvStringInput>[0],
): EngineeringIssue[] {
  const result: ValidationResult =
    validatePvStringInput(input);

  return result.issues;
}
