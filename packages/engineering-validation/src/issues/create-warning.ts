import type { EngineeringWarning } from "@ogwusearch/engineering-types";

export function createWarning(
  code: string,
  message: string,
  path?: string,
  metadata?: Record<string, unknown>,
): EngineeringWarning {
  return {
    code,
    severity: "WARNING",
    message,
    path,
    metadata,
  };
}