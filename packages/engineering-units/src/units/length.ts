// ============================================================
// @ogwusearch/engineering-units
// Length Units
// ============================================================

/**
 * Length units.
 *
 * SI base unit:
 *   metre (m)
 */

export interface LengthUnit {
  readonly symbol: string;
  readonly name: string;
  readonly toMetres: number;
}

/**
 * Metre (m)
 *
 * SI base unit of length.
 */
export const METRE: LengthUnit = {
  symbol: "m",
  name: "metre",
  toMetres: 1,
};

/**
 * Kilometre (km)
 *
 * 1 km = 1,000 m
 */
export const KILOMETRE: LengthUnit = {
  symbol: "km",
  name: "kilometre",
  toMetres: 1e3,
};

/**
 * Centimetre (cm)
 *
 * 1 cm = 0.01 m
 */
export const CENTIMETRE: LengthUnit = {
  symbol: "cm",
  name: "centimetre",
  toMetres: 1e-2,
};

/**
 * Millimetre (mm)
 *
 * 1 mm = 0.001 m
 */
export const MILLIMETRE: LengthUnit = {
  symbol: "mm",
  name: "millimetre",
  toMetres: 1e-3,
};

/**
 * Micrometre (µm)
 *
 * 1 µm = 0.000001 m
 */
export const MICROMETRE: LengthUnit = {
  symbol: "µm",
  name: "micrometre",
  toMetres: 1e-6,
};

/**
 * Nanometre (nm)
 *
 * 1 nm = 0.000000001 m
 */
export const NANOMETRE: LengthUnit = {
  symbol: "nm",
  name: "nanometre",
  toMetres: 1e-9,
};

/**
 * Inch (in)
 *
 * 1 in = 0.0254 m
 */
export const INCH: LengthUnit = {
  symbol: "in",
  name: "inch",
  toMetres: 0.0254,
};

/**
 * Foot (ft)
 *
 * 1 ft = 0.3048 m
 */
export const FOOT: LengthUnit = {
  symbol: "ft",
  name: "foot",
  toMetres: 0.3048,
};

/**
 * Yard (yd)
 *
 * 1 yd = 0.9144 m
 */
export const YARD: LengthUnit = {
  symbol: "yd",
  name: "yard",
  toMetres: 0.9144,
};

/**
 * Mile (mi)
 *
 * 1 mi = 1,609.344 m
 */
export const MILE: LengthUnit = {
  symbol: "mi",
  name: "mile",
  toMetres: 1609.344,
};

/**
 * Nautical mile (nmi)
 *
 * 1 nmi = 1,852 m
 */
export const NAUTICAL_MILE: LengthUnit = {
  symbol: "nmi",
  name: "nautical mile",
  toMetres: 1852,
};

/**
 * All supported length units.
 */
export const LENGTH_UNITS = {
  m: METRE,
  km: KILOMETRE,
  cm: CENTIMETRE,
  mm: MILLIMETRE,
  "µm": MICROMETRE,
  nm: NANOMETRE,
  in: INCH,
  ft: FOOT,
  yd: YARD,
  mi: MILE,
  nmi: NAUTICAL_MILE,
} as const;