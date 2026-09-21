
import type {
  EngineeringMetadata,
  EngineeringResult,
} from "@ogwusearch/engineering-types";

import type { EngineeringModule } from "./module";

const DEFAULT_ENGINE_VERSION = "0.1.0";
const DEFAULT_CALCULATION_VERSION = "0.1.0";
const DEFAULT_MODULE_VERSION = "0.1.0";

export function runEngineeringModule<I, V extends I, O>(
  input: I,
  module: EngineeringModule<I, V, O>,
  metadata?: EngineeringMetadata,
): EngineeringResult<O> {
  const resolvedMetadata: EngineeringMetadata =
    metadata ?? {
      engineVersion: DEFAULT_ENGINE_VERSION,
      calculationVersion: DEFAULT_CALCULATION_VERSION,
      moduleVersion: DEFAULT_MODULE_VERSION,
      calculatedAt: new Date().toISOString(),
    };

  const validation = module.validate(input);

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      warnings: validation.warnings,
      metadata: resolvedMetadata,
    };
  }

  const calculation = module.calculate(input as V);

  return {
    success: true,
    value: calculation.value,
    errors: [],
    warnings: validation.warnings,
    trace: calculation.trace,
    metadata: resolvedMetadata,
  };
}
