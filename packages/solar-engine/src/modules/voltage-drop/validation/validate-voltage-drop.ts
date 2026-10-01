import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  VoltageDropInput,
} from "../types/index.js";

import {
  validateVoltageDropInputRules,
} from "./rules.js";

export function validateVoltageDropInput(
  input: VoltageDropInput,
): EngineeringIssue[] {
  return validateVoltageDropInputRules(
    input,
  );
}