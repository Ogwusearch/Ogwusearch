import {
  calculatePeakDemand as calculate,
  createCalculationTrace,
} from "./calculations";

import { validatePeakDemandInput } from "./validation";
import { generateWarnings } from "./warnings";

import type {
  PeakDemandInput,
  PeakDemandResult,
} from "./types";

export const PEAK_DEMAND_ENGINE_VERSION = "0.1.0";

export const PEAK_DEMAND_ENGINE_METADATA = {
  engine: "peak-demand" as const,
  version: PEAK_DEMAND_ENGINE_VERSION,
  unitSystem: "SI" as const,
};

export function validatePeakDemand(
  input: unknown,
) {
  return validatePeakDemandInput(input);
}

export function calculatePeakDemand(
  input: PeakDemandInput,
): PeakDemandResult {
  const validation = validatePeakDemandInput(input);

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      warnings: validation.warnings,
      metadata: PEAK_DEMAND_ENGINE_METADATA,
    };
  }

  const value = calculate(input);

  const warnings = generateWarnings(input, value);

  const trace = createCalculationTrace(input, value);

  return {
    success: true,
    value,
    errors: [],
    warnings,
    trace,
    metadata: PEAK_DEMAND_ENGINE_METADATA,
  };
}

export type {
  PeakDemandInput,
  PeakDemandLoad,
  PeakDemandLoadResult,
  PeakDemandValue,
  EngineeringMessage,
  ValidationResult,
  PeakDemandCalculationTrace,
  PeakDemandMetadata,
  PeakDemandResult,
} from "./types";