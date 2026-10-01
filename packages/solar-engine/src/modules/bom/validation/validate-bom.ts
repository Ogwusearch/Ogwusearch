import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  BOMInput,
} from "../types/index.js";

import {
  validateBOMItems,
} from "./rules.js";

export function validateBOM(
  input: BOMInput,
): EngineeringIssue[] {
  /*
   * Source-level validation is intentionally performed here
   * without inventing quantities or modifying upstream results.
   */
  const issues: EngineeringIssue[] = [];

  const results = [
    input.pv,
    input.battery,
    input.inverter,
    input.chargeController,
    input.cable,
    input.protection,
    input.earthing,
    ...(input.additionalResults ?? []),
  ];

  for (const result of results) {
    if (
      result !== undefined &&
      result.valid &&
      result.value === undefined
    ) {
      issues.push({
        code: "INVALID_BOM_ITEM",
        severity: "ERROR",
        message:
          "A valid source calculation must expose a calculation value.",
        path: "sourceResult.value",
      });
    }
  }

  return issues;
}

export function validateBOMOutput(
  items: Parameters<typeof validateBOMItems>[0],
): EngineeringIssue[] {
  return validateBOMItems(items);
}
