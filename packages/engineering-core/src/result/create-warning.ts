import type {
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

export function createWarning(
  code: string,
  message: string,
  path?: string,
): EngineeringWarning {
  return path === undefined
    ? {
        code,
        severity: "WARNING",
        message,
      }
    : {
        code,
        severity: "WARNING",
        message,
        path,
      };
}
