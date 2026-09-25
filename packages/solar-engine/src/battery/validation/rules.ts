

export interface BatteryValidationIssue {
  code: string;
  field: string;
  message: string;
  value?: unknown;
}

export function positiveNumber(
  field: string,
  value: unknown,
): BatteryValidationIssue | undefined {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return {
      code: "VALUE_MUST_BE_POSITIVE",
      field,
      message: `${field} must be a finite number greater than zero.`,
      value,
    };
  }

  return undefined;
}

export function nonNegativeNumber(
  field: string,
  value: unknown,
): BatteryValidationIssue | undefined {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return {
      code: "VALUE_MUST_BE_NON_NEGATIVE",
      field,
      message: `${field} must be a finite number greater than or equal to zero.`,
      value,
    };
  }

  return undefined;
}