import type { EngineeringIssue } from "@ogwusearch/engineering-types";

import type { SystemValidationInput } from "../types/index.js";

import { validateSystemInput } from "./rules.js";

export function validateSystem(
  input: SystemValidationInput,
): EngineeringIssue[] {
  return validateSystemInput(input);
}