import type {
  EarthingInput,
} from "../types/index.js";

/**
 * Calculates the required bonding-conductor area.
 *
 * Formula:
 *
 * bondingArea =
 *   earthConductorArea × bondingFactor
 *
 * The bonding factor must be explicitly supplied
 * when a project-specific value is required.
 */
export function calculateBondingConductorArea(
  earthConductorAreaMm2: number,
  input: EarthingInput,
): number {
  const bondingFactor =
    input.design?.bondingConductorFactor ?? 1;

  return (
    earthConductorAreaMm2 *
    bondingFactor
  );
}