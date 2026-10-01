import type { EngineeringIssue } from "@ogwusearch/engineering-types";

import type { ProtectionInput } from "../types/index.js";

import { validateProtectionRules } from "./rules.js";

export function validateProtection(
  input: ProtectionInput,
): EngineeringIssue[] {
  return validateProtectionRules(input);
}