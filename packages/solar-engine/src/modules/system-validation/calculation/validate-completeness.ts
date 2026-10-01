import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  SystemValidationInput,
  SystemValidationCheck,
} from "../types/index.js";

export function validateCompleteness(
  input: SystemValidationInput,
): SystemValidationCheck[] {
  const checks: SystemValidationCheck[] = [];

  const resultCount =
    [
      input.peakDemand,
      input.pvArray,
      input.inverter,
      input.battery,
      input.chargeController,
      input.cable,
      input.voltageDrop,
      input.protection,
    ].filter(
      (result): result is CalculationResult =>
        result !== undefined,
    ).length +
    (input.additionalResults?.length ?? 0);

  checks.push({
    code: "SYSTEM_INPUT_COMPLETE",
    name: "System input completeness",
    status:
      resultCount > 0
        ? "PASS"
        : "FAIL",
    actual: resultCount,
    expected: "> 0",
    message:
      resultCount > 0
        ? "Authoritative engineering results are available."
        : "No authoritative engineering results were supplied.",
  });

  if (
    input.peakDemand !== undefined &&
    input.inverter === undefined
  ) {
    checks.push({
      code: "MISSING_REQUIRED_RESULT",
      name: "Peak demand → inverter",
      status: "NOT_EVALUATED",
      message:
        "Inverter capacity cannot be validated because the inverter result is missing.",
    });
  }

  if (
    input.cable !== undefined &&
    input.protection === undefined
  ) {
    checks.push({
      code: "MISSING_REQUIRED_RESULT",
      name: "Cable → protection",
      status: "NOT_EVALUATED",
      message:
        "Cable/protection compatibility cannot be validated because the protection result is missing.",
    });
  }

  return checks;
}