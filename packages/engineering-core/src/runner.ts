import type {
  EngineeringMetadata,
  EngineeringResult,
} from "@ogwusearch/engineering-types";

import type { EngineeringModule } from "./module";

export function runEngineeringModule<
  I,
  V extends I,
  O
>(
  input: I,
  module: EngineeringModule<I, V, O>,
  metadata?: EngineeringMetadata,
): EngineeringResult<O> {
  const resolvedMetadata: EngineeringMetadata =
    metadata ?? {
      engineVersion: "0.1.0",
      calculationVersion: "0.1.0",
      moduleVersion: "0.1.0",
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