// ============================================================
// @ogwusearch/engineering-units
// Temperature Units
// ============================================================

import type { Unit } from "./unit.js";
import { TEMPERATURE } from "../dimensions/dimensions.js";

/**
 * Temperature units.
 *
 * Kelvin is the base unit.
 */
export interface TemperatureUnit extends Unit {
  readonly toKelvin: (value: number) => number;
  readonly fromKelvin: (value: number) => number;
}

/**
 * Creates a temperature unit using Kelvin as the base unit.
 */
function createTemperatureUnit(
  symbol: string,
  name: string,
  toKelvin: (value: number) => number,
  fromKelvin: (value: number) => number,
): TemperatureUnit {
  return {
    symbol,
    name,
    dimension: TEMPERATURE,
    toKelvin,
    fromKelvin,
    toBase: toKelvin,
    fromBase: fromKelvin,
  };
}

/**
 * Kelvin (K)
 *
 * SI base unit of thermodynamic temperature.
 */
export const KELVIN = createTemperatureUnit(
  "K",
  "kelvin",
  (value) => value,
  (value) => value,
);

/**
 * Celsius (°C)
 *
 * K = °C + 273.15
 */
export const CELSIUS = createTemperatureUnit(
  "°C",
  "celsius",
  (value) => value + 273.15,
  (value) => value - 273.15,
);

/**
 * Fahrenheit (°F)
 *
 * K = ((°F - 32) × 5 / 9) + 273.15
 */
export const FAHRENHEIT = createTemperatureUnit(
  "°F",
  "fahrenheit",
  (value) => ((value - 32) * 5) / 9 + 273.15,
  (value) => ((value - 273.15) * 9) / 5 + 32,
);

/**
 * Rankine (°R)
 *
 * K = °R × 5 / 9
 */
export const RANKINE = createTemperatureUnit(
  "°R",
  "rankine",
  (value) => (value * 5) / 9,
  (value) => (value * 9) / 5,
);

/**
 * All supported temperature units.
 */
export const TEMPERATURE_UNITS = {
  K: KELVIN,
  C: CELSIUS,
  F: FAHRENHEIT,
  R: RANKINE,
} as const;
