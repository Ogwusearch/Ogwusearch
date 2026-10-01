import type { EngineeringIssue } from "@ogwusearch/engineering-types";

export function invalid(
  code: string,
  message: string,
  path: string,
  actual?: unknown,
): EngineeringIssue {
  return {
    code,
    severity: "ERROR",
    message,
    path,
    actual,
  };
}

export function warning(
  code: string,
  message: string,
  path: string,
  actual?: unknown,
): EngineeringIssue {
  return {
    code,
    severity: "WARNING",
    message,
    path,
    actual,
  };
}
