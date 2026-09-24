// ============================================================
// @ogwusearch/engineering-units
// Temperature Units
// ============================================================

/**
 * Temperature units.
 *
 * Unlike simple linear units, temperature conversions may require
 * both a scale factor and an offset.
 *
 * Canonical internal unit:
 *   kelvin (K)
 */

export interface TemperatureUnit {
  readonly symbol: string;
  readonly name: string;

  /**
   * Convert a value from this unit to kelvin.
   */
  readonly toKelvin: (value: number) => number;

  /**
   * Convert a value from kelvin to this unit.
   */
  readonly fromKelvin: (value: number) => number;
}

/**
 * Kelvin (K)
 *
 * SI base unit of thermodynamic temperature.
 */
export const KELVIN: TemperatureUnit = {
  symbol: "K",
  name: "kelvin",

  toKelvin: (value) => value,

  fromKelvin: (value) => value,
};

/**
 * Celsius (°C)
 *
 * K = °C + 273.15
 */
export const CELSIUS: TemperatureUnit = {
  symbol: "°C",
  name: "degree Celsius",

  toKelvin: (value) => value + 273.15,

  fromKelvin: (value) => value - 273.15,
};

/**
 * Fahrenheit (°F)
 *
 * K = (°F - 32) × 5/9 + 273.15
 */
export const FAHRENHEIT: TemperatureUnit = {
  symbol: "°F",
  name: "degree Fahrenheit",

  toKelvin: (value) => ((value - 32) * 5) / 9 + 273.15,

  fromKelvin: (value) => ((value - 273.15) * 9) / 5 + 32,
};

/**
 * Rankine (°R)
 *
 * K = °R × 5/9
 */
export const RANKINE: TemperatureUnit = {
  symbol: "°R",
  name: "degree Rankine",

  toKelvin: (value) => (value * 5) / 9,

  fromKelvin: (value) => (value * 9) / 5,
};

/**
 * All supported temperature units.
 */
export const TEMPERATURE_UNITS = {
  K: KELVIN,
  "°C": CELSIUS,
  "°F": FAHRENHEIT,
  "°R": RANKINE,
} as const;