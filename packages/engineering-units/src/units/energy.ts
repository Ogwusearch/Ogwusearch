// ============================================================
// @ogwusearch/engineering-units
// Energy Units
// ============================================================

import type { Unit } from "./unit.js";
import { ENERGY } from "../dimensions/dimensions.js";

/**
 * Energy units.
 *
 * SI derived unit:
 *   joule (J)
 *
 * 1 J = 1 W·s
 * 1 J = 1 N·m
 */
export interface EnergyUnit extends Unit {
  readonly toJoules: number;
}

/**
 * Creates an energy unit using joules as the base unit.
 */
function createEnergyUnit(
  symbol: string,
  name: string,
  toJoules: number,
): EnergyUnit {
  return {
    symbol,
    name,
    dimension: ENERGY,
    toJoules,
    toBase: (value) => value * toJoules,
    fromBase: (value) => value / toJoules,
  };
}

/**
 * Joule (J)
 *
 * SI unit of energy.
 */
export const JOULE = createEnergyUnit(
  "J",
  "joule",
  1,
);

/**
 * Kilojoule (kJ)
 *
 * 1 kJ = 1,000 J
 */
export const KILOJOULE = createEnergyUnit(
  "kJ",
  "kilojoule",
  1e3,
);

/**
 * Megajoule (MJ)
 *
 * 1 MJ = 1,000,000 J
 */
export const MEGAJOULE = createEnergyUnit(
  "MJ",
  "megajoule",
  1e6,
);

/**
 * Millijoule (mJ)
 *
 * 1 mJ = 0.001 J
 */
export const MILLIJOULE = createEnergyUnit(
  "mJ",
  "millijoule",
  1e-3,
);

/**
 * Watt-hour (Wh)
 *
 * 1 Wh = 3,600 J
 */
export const WATT_HOUR = createEnergyUnit(
  "Wh",
  "watt-hour",
  3600,
);

/**
 * Kilowatt-hour (kWh)
 *
 * 1 kWh = 3,600,000 J
 */
export const KILOWATT_HOUR = createEnergyUnit(
  "kWh",
  "kilowatt-hour",
  3.6e6,
);

/**
 * Megawatt-hour (MWh)
 *
 * 1 MWh = 3,600,000,000 J
 */
export const MEGAWATT_HOUR = createEnergyUnit(
  "MWh",
  "megawatt-hour",
  3.6e9,
);

/**
 * Gigawatt-hour (GWh)
 *
 * 1 GWh = 3,600,000,000,000 J
 */
export const GIGAWATT_HOUR = createEnergyUnit(
  "GWh",
  "gigawatt-hour",
  3.6e12,
);

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