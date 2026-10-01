import type {
  PvStringInput,
  PvStringOutput,
} from "./types/index.js";

import {
  calculatePvString as calculateStandardPvString,
} from "./calculation/calculate-pv-string.js";

/**
 * Backward-compatible PV string calculation entry point.
 *
 * The engineering implementation lives in the standardized
 * calculation module.
 */
export function calculatePvString(
  input: PvStringInput,
): PvStringOutput {
  return calculateStandardPvString(input);
}
