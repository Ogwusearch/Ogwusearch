
// ============================================================
// Solar Engine
// Load Validation
// ============================================================

import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  Load,
} from "../types/load.js";

import {
  validateLoad as validateLoadRules,
} from "./rules.js";

export function validateLoad(
  load: Load,
): EngineeringIssue[] {
  return validateLoadRules(load);
}
