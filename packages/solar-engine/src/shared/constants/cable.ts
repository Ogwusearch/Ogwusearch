/**
 * Cable engineering constants.
 *
 * These values are reference constants used by solar-engineering
 * calculations. They are not substitutes for cable manufacturer
 * data, installation-specific ampacity tables, or jurisdictional
 * requirements.
 *
 * Units:
 * - Resistivity: Ω·m
 * - Temperature coefficient: 1/°C
 * - Voltage-drop limits: decimal fraction
 * - Cable cross-sectional area: mm²
 */

/**
 * Electrical resistivity at the reference temperature.
 *
 * Copper:
 *   approximately 1.724 × 10⁻⁸ Ω·m
 *
 * Aluminium:
 *   approximately 2.826 × 10⁻⁸ Ω·m
 */
export const COPPER_RESISTIVITY_OHM_M = 1.724e-8;

export const ALUMINIUM_RESISTIVITY_OHM_M = 2.826e-8;

/**
 * Approximate conductor resistance temperature coefficients.
 *
 * Formula:
 *   R_T = R_ref × [1 + α × (T - T_ref)]
 */
export const COPPER_TEMPERATURE_COEFFICIENT_PER_C = 0.00393;

export const ALUMINIUM_TEMPERATURE_COEFFICIENT_PER_C = 0.00403;

/**
 * Default design voltage-drop limits.
 *
 * Values are decimal fractions:
 *
 *   0.03 = 3%
 *   0.05 = 5%
 */
export const DEFAULT_DC_VOLTAGE_DROP_LIMIT = 0.03;

export const DEFAULT_AC_VOLTAGE_DROP_LIMIT = 0.05;

/**
 * Recommended reference voltage-drop limits for selected
 * solar-system applications.
 *
 * These are engineering design defaults, not universal
 * compliance requirements.
 */
export const RECOMMENDED_PV_STRING_DROP_LIMIT = 0.02;

export const RECOMMENDED_BATTERY_DROP_LIMIT = 0.02;

/**
 * Common metric conductor cross-sectional areas.
 *
 * Units:
 *   mm²
 *
 * This is a reference selection list only. Actual cable selection
 * must also consider ampacity, installation method, temperature,
 * grouping, insulation, fault conditions, and applicable standards.
 */
export const STANDARD_CABLE_SIZES_MM2 = [
  1.5,
  2.5,
  4,
  6,
  10,
  16,
  25,
  35,
  50,
  70,
  95,
  120,
  150,
  185,
  240,
] as const;

/**
 * Common conductor materials supported by the shared cable formulas.
 */
export const CABLE_CONDUCTOR_MATERIALS = [
  "copper",
  "aluminium",
] as const;

export type CableConductorMaterial =
  (typeof CABLE_CONDUCTOR_MATERIALS)[number];