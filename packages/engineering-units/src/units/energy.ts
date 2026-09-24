// ============================================================
// @ogwusearch/engineering-units
// Energy Units
// ============================================================

/**
 * Energy units.
 *
 * SI derived unit:
 *   joule (J)
 *
 * 1 J = 1 W·s
 * 1 J = 1 N·m
 */

export interface EnergyUnit {
  readonly symbol: string;
  readonly name: string;
  readonly toJoules: number;
}

/**
 * Joule (J)
 *
 * SI unit of energy.
 */
export const JOULE: EnergyUnit = {
  symbol: "J",
  name: "joule",
  toJoules: 1,
};

/**
 * Kilojoule (kJ)
 *
 * 1 kJ = 1,000 J
 */
export const KILOJOULE: EnergyUnit = {
  symbol: "kJ",
  name: "kilojoule",
  toJoules: 1e3,
};

/**
 * Megajoule (MJ)
 *
 * 1 MJ = 1,000,000 J
 */
export const MEGAJOULE: EnergyUnit = {
  symbol: "MJ",
  name: "megajoule",
  toJoules: 1e6,
};

/**
 * Millijoule (mJ)
 *
 * 1 mJ = 0.001 J
 */
export const MILLIJOULE: EnergyUnit = {
  symbol: "mJ",
  name: "millijoule",
  toJoules: 1e-3,
};

/**
 * Watt-hour (Wh)
 *
 * 1 Wh = 3,600 J
 */
export const WATT_HOUR: EnergyUnit = {
  symbol: "Wh",
  name: "watt-hour",
  toJoules: 3600,
};

/**
 * Kilowatt-hour (kWh)
 *
 * 1 kWh = 3,600,000 J
 */
export const KILOWATT_HOUR: EnergyUnit = {
  symbol: "kWh",
  name: "kilowatt-hour",
  toJoules: 3.6e6,
};

/**
 * Megawatt-hour (MWh)
 *
 * 1 MWh = 3,600,000,000 J
 */
export const MEGAWATT_HOUR: EnergyUnit = {
  symbol: "MWh",
  name: "megawatt-hour",
  toJoules: 3.6e9,
};

/**
 * Gigawatt-hour (GWh)
 *
 * 1 GWh = 3,600,000,000,000 J
 */
export const GIGAWATT_HOUR: EnergyUnit = {
  symbol: "GWh",
  name: "gigawatt-hour",
  toJoules: 3.6e12,
};

/**
 * All supported energy units.
 */
export const ENERGY_UNITS = {
  J: JOULE,
  kJ: KILOJOULE,
  MJ: MEGAJOULE,
  mJ: MILLIJOULE,
  Wh: WATT_HOUR,
  kWh: KILOWATT_HOUR,
  MWh: MEGAWATT_HOUR,
  GWh: GIGAWATT_HOUR,
} as const;