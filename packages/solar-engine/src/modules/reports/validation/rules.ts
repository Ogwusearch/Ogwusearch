import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  ReportsInput,
} from "../types/index.js";

export function validateReportsInput(
  input: ReportsInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  if (
    input.reportId !== undefined &&
    (
      typeof input.reportId !== "string" ||
      input.reportId.trim().length === 0
    )
  ) {
    issues.push({
      code: "INVALID_REPORT_ID",
      severity: "ERROR",
      message:
        "Report ID must be a non-empty string when supplied.",
      path: "reportId",
      actual: input.reportId,
    });
  }

  if (
    input.title !== undefined &&
    (
      typeof input.title !== "string" ||
      input.title.trim().length === 0
    )
  ) {
    issues.push({
      code: "INVALID_REPORT_TITLE",
      severity: "ERROR",
      message:
        "Report title must be a non-empty string when supplied.",
      path: "title",
      actual: input.title,
    });
  }

  const hasNamedResult =
    input.load !== undefined ||
    input.energy !== undefined ||
    input.peakDemand !== undefined ||
    input.pvSizing !== undefined ||
    input.pvArray !== undefined ||
    input.pvString !== undefined ||
    input.battery !== undefined ||
    input.inverter !== undefined ||
    input.chargeController !== undefined ||
    input.cable !== undefined ||
    input.voltageDrop !== undefined ||
    input.protection !== undefined ||
    input.earthing !== undefined ||
    input.generator !== undefined ||
    input.bom !== undefined ||
    input.costing !== undefined ||
    input.systemValidation !== undefined;

  const hasAdditionalResults =
    (input.additionalResults?.length ?? 0) > 0;

  if (!hasNamedResult && !hasAdditionalResults) {
    issues.push({
      code: "REPORT_NO_RESULTS",
      severity: "ERROR",
      message:
        "At least one calculation result is required to build a report.",
      path: "results",
    });
  }

  return issues;
}
