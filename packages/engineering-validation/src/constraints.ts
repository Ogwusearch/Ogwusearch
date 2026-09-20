import type { ValidationIssue } from "./errors";

export function lessThanOrEqual(
  field: string,
  value: number,
  maximum: number,
  maximumField: string,
): ValidationIssue[] {
  if (value > maximum) {
    return [
      {
        code: "MAXIMUM_EXCEEDED",
        field,
        message:
          `${field} exceeds ${maximumField}.`,
        severity: "error",
        value,
        expected: maximum,
      },
    ];
  }

  return [];
}

export function greaterThanOrEqual(
  field: string,
  value: number,
  minimum: number,
  minimumField: string,
): ValidationIssue[] {
  if (value < minimum) {
    return [
      {
        code: "MINIMUM_NOT_MET",
        field,
        message:
          `${field} is below ${minimumField}.`,
        severity: "error",
        value,
        expected: minimum,
      },
    ];
  }

  return [];
}

export function compatibleValues(
  fieldA: string,
  valueA: number,
  fieldB: string,
  valueB: number,
  tolerance = 0,
): ValidationIssue[] {
  if (Math.abs(valueA - valueB) > tolerance) {
    return [
      {
        code: "INCOMPATIBLE_VALUES",
        field: fieldA,
        message:
          `${fieldA} is incompatible with ${fieldB}.`,
        severity: "error",
        value: valueA,
        expected: valueB,
      },
    ];
  }

  return [];
}