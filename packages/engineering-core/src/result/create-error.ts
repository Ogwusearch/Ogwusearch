import type {
  EngineeringError,
} from "@ogwusearch/engineering-types";

export function createError(
  code: string,
  message: string,
  path?: string,
): EngineeringError {
  return path === undefined
    ? {
        code,
        severity: "ERROR",
        message,
      }
    : {
        code,
        severity: "ERROR",
        message,
        path,
      };
}
