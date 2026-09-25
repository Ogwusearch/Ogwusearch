
// ============================================================
// PV Sizing
// Backward-Compatible Calculation API
// ============================================================

import type {
  PVSizingInput,
  PVSizingValue,
} from "./types/index.js";

import {
  calculatePVSizing as calculateStandardPVSizing,
} from "./calculation/calculate-pv-sizing.js";

/**
 * Backward-compatible PV sizing calculation API.
 *
 * The engineering formulas are implemented in
 * ./calculation/calculate-pv-sizing.ts.
 *
 * This wrapper preserves the existing calculatePVSizing()
 * entry point while delegating to the standardized calculation.
 */
export function calculatePVSizing(
  input: PVSizingInput,
): PVSizingValue {
  return calculateStandardPVSizing(input);
}
