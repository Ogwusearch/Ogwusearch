import type {
  CalculationTrace,
} from "./trace";

import type {
  ValidationError,
  ValidationWarning,
} from "./validation";

import type {
  EngineeringMetadata,
} from "./metadata";

export interface EngineeringResult<T> {
  success: boolean;
  value?: T;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  trace?: CalculationTrace;
  metadata: EngineeringMetadata;
}