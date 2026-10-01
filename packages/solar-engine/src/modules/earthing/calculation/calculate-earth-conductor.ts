import type {
  EarthingInput,
} from "../types/index.js";

/**
 * Calculates the required earth-conductor area.
 *
 * Formula:
 *
 * S = I × √t / k
 *
 * where:
 * S = conductor area in mm²
 * I = fault current in A
 * t = fault-clearing time in s
 * k = conductor constant
 *
 * The design margin is applied after the base
 * conductor area is calculated.
 */
export function calculateEarthConductorArea(
  input: EarthingInput,
): number {
  const {
    faultCurrentA,
    faultClearingTimeS,
    conductorConstantA_SqrtS_PerMm2,
  } = input.electrical;

  const designMargin =
    input.design?.designMargin ?? 0;

  const baseArea =
    (faultCurrentA *
      Math.sqrt(faultClearingTimeS)) /
    conductorConstantA_SqrtS_PerMm2;

  return baseArea * (1 + designMargin);
}