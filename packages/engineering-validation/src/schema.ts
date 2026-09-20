import type { ValidationIssue } from "./errors";

export function required(
  field: string,
  value: unknown,
): ValidationIssue | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return {
      code: "REQUIRED_FIELD",
      field,
      message: `${field} is required.`,
      severity: "error",
      value,
    };
  }

  return null;
}

export function number(
  field: string,
  value: unknown,
): ValidationIssue | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return {
      code: "INVALID_NUMBER",
      field,
      message: `${field} must be a valid number.`,
      severity: "error",
      value,
    };
  }

  return null;
}

export function positive(
  field: string,
  value: number,
): ValidationIssue | null {
  if (value <= 0) {
    return {
      code: "MUST_BE_POSITIVE",
      field,
      message: `${field} must be greater than zero.`,
      severity: "error",
      value,
    };
  }

  return null;
}

export function nonNegative(
  field: string,
  value: number,
): ValidationIssue | null {
  if (value < 0) {
    return {
      code: "MUST_BE_NON_NEGATIVE",
      field,
      message: `${field} cannot be negative.`,
      severity: "error",
      value,
    };
  }

  return null;
}