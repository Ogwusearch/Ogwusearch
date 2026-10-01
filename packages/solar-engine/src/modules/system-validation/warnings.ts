import type {
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import type {
  SystemValidationOutput,
} from "./types/index.js";

export function createSystemValidationWarnings(
  output: SystemValidationOutput,
): EngineeringWarning[] {
  return output.checks
    .filter(
      (check) =>
        check.status === "WARNING",
    )
    .map((check) => ({
      code: check.code,
      severity: "WARNING" as const,
      message: check.message,
      ...(check.expected !== undefined && {
        expected: check.expected,
      }),
      ...(check.actual !== undefined && {
        actual: check.actual,
      }),
    }));
}