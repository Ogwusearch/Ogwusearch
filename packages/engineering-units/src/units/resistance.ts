// ============================================================
// @ogwusearch/engineering-units
// Electrical Resistance Units
// ============================================================

/**
 * Electrical resistance units.
 *
 * SI derived unit:
 *   ohm (Ω)
 *
 * 1 Ω = 1 V / A
 */

export interface ResistanceUnit {
  readonly symbol: string;
  readonly name: string;
  readonly toOhms: number;
}

/**
 * Ohm (Ω)
 *
 * SI unit of electrical resistance.
 */
export const OHM: ResistanceUnit = {
  symbol: "Ω",
  name: "ohm",
  toOhms: 1,
};

/**
 * Milliohm (mΩ)
 *
 * 1 mΩ = 0.001 Ω
 */
export const MILLIOHM: ResistanceUnit = {
  symbol: "mΩ",
  name: "milliohm",
  toOhms: 1e-3,
};

/**
 * Microohm (µΩ)
 *
 * 1 µΩ = 0.000001 Ω
 */
export const MICROOHM: ResistanceUnit = {
  symbol: "µΩ",
  name: "microohm",
  toOhms: 1e-6,
};

/**
 * Kiloohm (kΩ)
 *
 * 1 kΩ = 1,000 Ω
 */
export const KILOOHM: ResistanceUnit = {
  symbol: "kΩ",
  name: "kiloohm",
  toOhms: 1e3,
};

/**
 * Megaohm (MΩ)
 *
 * 1 MΩ = 1,000,000 Ω
 */
export const MEGAOHM: ResistanceUnit = {
  symbol: "MΩ",
  name: "megaohm",
  toOhms: 1e6,
};

/**
 * All supported resistance units.
 */
export const RESISTANCE_UNITS = {
  Ω: OHM,
  mΩ: MILLIOHM,
  "µΩ": MICROOHM,
  kΩ: KILOOHM,
  MΩ: MEGAOHM,
} as const;