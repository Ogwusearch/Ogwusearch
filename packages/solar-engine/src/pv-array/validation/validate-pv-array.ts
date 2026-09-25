import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  PvArrayInput,
} from "../types/index.js";

import {
  validatePvArray,
} from "./rules.js";

export function validatePvArrayInput(
  input: PvArrayInput,
): EngineeringIssue[] {
  return validatePvArray(input);
}