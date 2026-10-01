import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  EarthingInput,
} from "../types/index.js";

import {
  validateEarthingRules,
} from "./rules.js";

export function validateEarthing(
  input: EarthingInput,
): EngineeringIssue[] {
  return validateEarthingRules(input);
}