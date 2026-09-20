import type { ValidationIssue } from "./errors";
import {
  number,
  positive,
  nonNegative,
} from "./schema";

export function validateNumber(
  field: string,
  value: unknown,
): ValidationIssue[] {
  const issue = number(field, value);

  return issue ? [issue] : [];
}

export function validatePositiveNumber(
  field: string,
  value: unknown,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const numberIssue = number(field, value);

  if (numberIssue) {
    issues.push(numberIssue);
    return issues;
  }

  const positiveIssue = positive(
    field,
    value as number,
  );

  if (positiveIssue) {
    issues.push(positiveIssue);
  }

  return issues;
}

export function validateNonNegativeNumber(
  field: string,
  value: unknown,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const numberIssue = number(field, value);

  if (numberIssue) {
    issues.push(numberIssue);
    return issues;
  }

  const nonNegativeIssue = nonNegative(
    field,
    value as number,
  );

  if (nonNegativeIssue) {
    issues.push(nonNegativeIssue);
  }

  return issues;
}

export function validateRange(
  field: string,
  value: number,
  min: number,
  max: number,
): ValidationIssue[] {
  if (value < min || value > max) {
    return [
      {
        code: "OUT_OF_RANGE",
        field,
        message: `${field} must be between ${min} and ${max}.`,
        severity: "error",
        value,
        expected: {
          min,
          max,
        },
      },
    ];
  }

  return [];
}