import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  EnergyInput,
} from "../types/energy-input.js";

import {
  validateEnergy as validateEnergyRules,
} from "./rules.js";

export function validateEnergy(
  input: EnergyInput,
): EngineeringIssue[] {
  return validateEnergyRules(input);
}
