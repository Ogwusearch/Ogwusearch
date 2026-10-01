import type {
  CalculationOutput,
  CalculationResult,
  EngineeringError,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

/**
 * Creates a calculation result while enforcing the core result
 * invariants.
 */
export function createResult<
  T extends CalculationOutput,
>(
  result: CalculationResult<T>,
): CalculationResult<T> {
  const hasErrors = result.errors.length > 0;

  if (hasErrors) {
    return {
      ...result,
      status: "ERROR",
      valid: false,
    };
  }

  if (!result.valid) {
    return {
      ...result,
      status: "ERROR",
      valid: false,
    };
  }

  if (result.warnings.length > 0) {
    return {
      ...result,
      status: "WARNING",
      valid: true,
    };
  }

  return {
    ...result,
    status: "SUCCESS",
    valid: true,
  };
}

/**
 * Narrow helper used by execution code when splitting issues.
 */
export function isEngineeringError(
  issue: { severity: "ERROR" | "WARNING" },
): issue is EngineeringError {
  return issue.severity === "ERROR";
}

/**
 * Narrow helper used by execution code when splitting issues.
 */
export function isEngineeringWarning(
  issue: { severity: "ERROR" | "WARNING" },
): issue is EngineeringWarning {
  return issue.severity === "WARNING";
}
