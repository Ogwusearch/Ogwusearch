import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  CableInput,
} from "../types/index.js";

import {
  validateCableInputRules,
} from "./rules.js";

export function validateCable(
  input: CableInput,
): EngineeringIssue[] {
  return validateCableInputRules(input);
}