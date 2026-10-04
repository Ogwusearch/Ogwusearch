// ============================================================
// @ogwusearch/engineering-units
// Charge Units
// ============================================================

import type { Unit } from "./unit.js";
import { CHARGE } from "../dimensions/dimensions.js";

/**
 * Charge units.
 *
 * SI derived unit:
 *   coulomb (C)
 *
 * 1 C = 1 A·s
 */
export interface ChargeUnit extends Unit {
  readonly toCoulombs: number;
}

/**
 * Creates a charge unit using coulombs as the base unit.
 */
function createChargeUnit(
  symbol: string,
  name: string,
  toCoulombs: number,
): ChargeUnit {
  return {
    symbol,
    name,
    dimension: CHARGE,
    toCoulombs,
    toBase: (value) => value * toCoulombs,
    fromBase: (value) => value / toCoulombs,
  };
}

/**
 * Coulomb (C)
 *
 * SI unit of electric charge.
 */
export const COULOMB = createChargeUnit(
  "C",
  "coulomb",
  1,
);

/**
 * Millicoulomb (mC)
 *
 * 1 mC = 0.001 C
 */
export const MILLICOULOMB = createChargeUnit(
  "mC",
  "millicoulomb",
  1e-3,
);

/**
 * Microcoulomb (µC)
 *
 * 1 µC = 0.000001 C
 */
export const MICROCOULOMB = createChargeUnit(
  "µC",
  "microcoulomb",
  1e-6,
);

/**
 * Nanocoulomb (nC)
 *
 * 1 nC = 0.000000001 C
 */
export const NANOCOULOMB = createChargeUnit(
  "nC",
  "nanocoulomb",
  1e-9,
);

/**
 * Kilocoulomb (kC)
 *
 * 1 kC = 1,000 C
 */
export const KILOCOULOMB = createChargeUnit(
  "kC",
  "kilocoulomb",
  1e3,
);

/**
 * Ampere-hour (Ah)
 *
 * 1 Ah = 3,600 C
 */
export const AMPERE_HOUR = createChargeUnit(
  "Ah",
  "ampere-hour",
  3600,
);

/**
 * Milliampere-hour (mAh)
 *
 * 1 mAh = 3.6 C
 */
export const MILLIAMPERE_HOUR = createChargeUnit(
  "mAh",
  "milliampere-hour",
  3.6,
);

/**
 * All supported charge units.
 */
export const CHARGE_UNITS = {
  C: COULOMB,
  mC: MILLICOULOMB,
  µC: MICROCOULOMB,
  nC: NANOCOULOMB,
  kC: KILOCOULOMB,
  Ah: AMPERE_HOUR,
  mAh: MILLIAMPERE_HOUR,
} as const;