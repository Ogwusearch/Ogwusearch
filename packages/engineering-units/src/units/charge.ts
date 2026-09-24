// ============================================================
// @ogwusearch/engineering-units
// Charge Units
// ============================================================

/**
 * Electric charge units.
 *
 * SI base unit:
 *   coulomb (C)
 *
 * Relationship:
 *   1 C = 1 A·s
 */

export interface ChargeUnit {
  readonly symbol: string;
  readonly name: string;
  readonly toCoulombs: number;
}

/**
 * Coulomb (C)
 *
 * SI unit of electric charge.
 */
export const COULOMB: ChargeUnit = {
  symbol: "C",
  name: "coulomb",
  toCoulombs: 1,
};

/**
 * Millicoulomb (mC)
 */
export const MILLICOULOMB: ChargeUnit = {
  symbol: "mC",
  name: "millicoulomb",
  toCoulombs: 1e-3,
};

/**
 * Microcoulomb (µC)
 */
export const MICROCOULOMB: ChargeUnit = {
  symbol: "µC",
  name: "microcoulomb",
  toCoulombs: 1e-6,
};

/**
 * Nanocoulomb (nC)
 */
export const NANOCOULOMB: ChargeUnit = {
  symbol: "nC",
  name: "nanocoulomb",
  toCoulombs: 1e-9,
};

/**
 * Kilocoulomb (kC)
 */
export const KILOCOULOMB: ChargeUnit = {
  symbol: "kC",
  name: "kilocoulomb",
  toCoulombs: 1e3,
};

/**
 * Ampere-hour (Ah).
 *
 * 1 Ah = 3600 C
 */
export const AMPERE_HOUR: ChargeUnit = {
  symbol: "Ah",
  name: "ampere-hour",
  toCoulombs: 3600,
};

/**
 * Milliampere-hour (mAh).
 *
 * 1 mAh = 3.6 C
 */
export const MILLIAMPERE_HOUR: ChargeUnit = {
  symbol: "mAh",
  name: "milliampere-hour",
  toCoulombs: 3.6,
};

/**
 * All supported charge units.
 */
export const CHARGE_UNITS = {
  C: COULOMB,
  mC: MILLICOULOMB,
  "µC": MICROCOULOMB,
  nC: NANOCOULOMB,
  kC: KILOCOULOMB,
  Ah: AMPERE_HOUR,
  mAh: MILLIAMPERE_HOUR,
} as const;