import type {
  InverterSizingInput,
  InverterSizingResult,
} from "./types";

import {
  validateInverterSizingInput,
} from "./validation";

import {
  calculateInverterSizing,
} from "./calculation";

import {
  generateInverterSizingWarnings,
} from "./warnings";

import {
  createInverterSizingTrace,
} from "./trace";

const INVERTER_SIZING_VERSION =
  "1.0.0";

export function runInverterSizing(
  input: InverterSizingInput,
): InverterSizingResult {
  const errors =
    validateInverterSizingInput(input);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      warnings: [],
      metadata: {
        engine: "inverter-sizing",
        version:
          INVERTER_SIZING_VERSION,
        unitSystem: "SI",
      },
    };
  }

  const value =
    calculateInverterSizing(input);

  const warnings =
    generateInverterSizingWarnings(
      input,
      value,
    );

  const trace =
    createInverterSizingTrace(
      input,
      value,
    );

  return {
    success: true,
    value,
    errors: [],
    warnings,
    trace,
    metadata: {
      engine: "inverter-sizing",
      version:
        INVERTER_SIZING_VERSION,
      unitSystem: "SI",
    },
  };
}