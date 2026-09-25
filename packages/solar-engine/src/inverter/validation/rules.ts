
import type { EngineeringMessage } from "../types";

export function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function validateRequiredPositive(
  errors: EngineeringMessage[],
  field: string,
  value: unknown,
  code: string,
  message: string,
): void {
  if (
    !isFiniteNumber(value) ||
    value <= 0
  ) {
    errors.push({
      code,
      field,
      message,
      value,
    });
  }
}

export function validateOptionalPositive(
  errors: EngineeringMessage[],
  field: string,
  value: unknown,
  code: string,
  message: string,
): void {
  if (value === undefined) {
    return;
  }

  if (
    !isFiniteNumber(value) ||
    value <= 0
  ) {
    errors.push({
      code,
      field,
      message,
      value,
    });
  }
}

export function validateRequiredUnitInterval(
  errors: EngineeringMessage[],
  field: string,
  value: unknown,
  code: string,
  message: string,
): void {
  if (
    !isFiniteNumber(value) ||
    value <= 0 ||
    value > 1
  ) {
    errors.push({
      code,
      field,
      message,
      value,
    });
  }
}

export function validateOptionalUnitInterval(
  errors: EngineeringMessage[],
  field: string,
  value: unknown,
  code: string,
  message: string,
): void {
  if (value === undefined) {
    return;
  }

  if (
    !isFiniteNumber(value) ||
    value <= 0 ||
    value > 1
  ) {
    errors.push({
      code,
      field,
      message,
      value,
    });
  }
}

export function validateGreaterThanOrEqual(
  errors: EngineeringMessage[],
  field: string,
  value: unknown,
  minimum: unknown,
  code: string,
  message: string,
): void {
  if (
    isFiniteNumber(value) &&
    isFiniteNumber(minimum) &&
    value >= minimum
  ) {
    return;
  }

  errors.push({
    code,
    field,
    message,
    value,
  });
}
