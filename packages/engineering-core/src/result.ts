
import type {
  EngineeringMetadata,
  EngineeringResult,
  ValidationError,
  ValidationWarning,
} from "@ogwusearch/engineering-types";

const DEFAULT_ENGINE_VERSION = "0.1.0";
const DEFAULT_CALCULATION_VERSION = "0.1.0";
const DEFAULT_MODULE_VERSION = "0.1.0";

export function createEngineeringMetadata(): EngineeringMetadata {
  return {
    engineVersion: DEFAULT_ENGINE_VERSION,
    calculationVersion: DEFAULT_CALCULATION_VERSION,
    moduleVersion: DEFAULT_MODULE_VERSION,
    calculatedAt: new Date().toISOString(),
  };
}

export function successResult<T>(
  value: T,
  metadata: EngineeringMetadata = createEngineeringMetadata(),
): EngineeringResult<T> {
  return {
    success: true,
    value,
    errors: [],
    warnings: [],
    metadata,
  };
}

export function failureResult<T>(
  errors: ValidationError[],
  warnings: ValidationWarning[] = [],
  metadata: EngineeringMetadata = createEngineeringMetadata(),
): EngineeringResult<T> {
  return {
    success: false,
    errors,
    warnings,
    metadata,
  };
}