import type {
  EngineeringResult,
  ValidationError,
  ValidationWarning,
} from "../../engineering-types/src";

export function successResult<T>(
  value: T,
): EngineeringResult<T> {
  return {
    success: true,
    value,
    errors: [],
    warnings: [],
    metadata: {
      engineVersion: "0.1.0",
      calculationVersion: "0.1.0",
      moduleVersion: "0.1.0",
      calculatedAt: new Date().toISOString(),
    },
  };
}

export function failureResult<T>(
  errors: ValidationError[],
  warnings: ValidationWarning[] = [],
): EngineeringResult<T> {
  return {
    success: false,
    errors,
    warnings,
    metadata: {
      engineVersion: "0.1.0",
      calculationVersion: "0.1.0",
      moduleVersion: "0.1.0",
      calculatedAt: new Date().toISOString(),
    },
  };
}