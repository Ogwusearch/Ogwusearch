import type {
  EarthingInput,
} from "../types/index.js";

/**
 * Calculates an approximate earth resistance for a
 * single vertical cylindrical electrode.
 *
 * Formula:
 *
 * R = ρ / (2πL) × ln(4L / d)
 *
 * where:
 * ρ = soil resistivity in Ω·m
 * L = electrode length in m
 * d = electrode diameter in m
 *
 * This calculation requires electrode diameter.
 */
export function calculateEarthResistance(
  input: EarthingInput,
): number | undefined {
  const resistivity =
    input.electrical.resistivityOhmM;

  const length =
    input.electrical.electrodeLengthM;

  const diameter =
    input.electrical.electrodeDiameterM;

  if (
    resistivity === undefined ||
    length === undefined ||
    diameter === undefined
  ) {
    return undefined;
  }

  return (
    (resistivity / (2 * Math.PI * length)) *
    Math.log((4 * length) / diameter)
  );
}