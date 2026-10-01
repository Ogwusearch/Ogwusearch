import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  ReportsInput,
} from "../types/index.js";

import {
  validateReportsInput,
} from "./rules.js";

export function validateReports(
  input: ReportsInput,
): EngineeringIssue[] {
  return validateReportsInput(input);
}
