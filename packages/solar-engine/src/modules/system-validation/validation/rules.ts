import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  SystemValidationInput,
} from "../types/index.js";

function isResultAvailable(
  result: CalculationResult | undefined,
): boolean {
  return result !== undefined;
}

export function validateSystemInput(
  input: SystemValidationInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  const hasResult =
    input.peakDemand !== undefined ||
    input.pvArray !== undefined ||
    input.inverter !== undefined ||
    input.battery !== undefined ||
    input.chargeController !== undefined ||
    input.cable !== undefined ||
    input.voltageDrop !== undefined ||
    input.protection !== undefined ||
    (input.additionalResults?.length ?? 0) > 0;

  if (!hasResult) {
    issues.push({
      code: "SYSTEM_INPUT_COMPLETE",
      severity: "ERROR",
      message:
        "At least one authoritative engineering calculation result is required.",
      path: "results",
    });
  }

  /*
   * These checks are intentionally about availability only.
   * Missing dependencies are not replaced with assumed values.
   */

  if (
    input.peakDemand !== undefined &&
    !isResultAvailable(input.inverter)
  ) {
    issues.push({
      code: "MISSING_REQUIRED_RESULT",
      severity: "ERROR",
      message:
        "Inverter result is required to validate inverter capacity against peak demand.",
      path: "inverter",
      expected: "CalculationResult",
    });
  }

  if (
    input.cable !== undefined &&
    !isResultAvailable(input.protection)
  ) {
    issues.push({
      code: "MISSING_REQUIRED_RESULT",
      severity: "ERROR",
      message:
        "Protection result is required to validate cable and protective-device compatibility.",
      path: "protection",
      expected: "CalculationResult",
    });
  }

  return issues;
}