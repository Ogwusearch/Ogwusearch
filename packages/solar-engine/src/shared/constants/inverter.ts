/**
 * Common inverter engineering constants.
 *
 * This module contains reusable reference values only.
 * It does not perform calculations or validation.
 */

/**
 * Default inverter conversion efficiency.
 *
 * 0.95 = 95%
 */
export const INVERTER_DEFAULT_EFFICIENCY = 0.95;

/**
 * Lower reference bound for generic inverter efficiency.
 *
 * This is a modeling bound, not a universal equipment requirement.
 */
export const INVERTER_MIN_EFFICIENCY = 0.80;

/**
 * Upper mathematical bound for inverter efficiency.
 */
export const INVERTER_MAX_EFFICIENCY = 1.0;

/**
 * Default inverter design margin.
 *
 * 0.25 = 25% additional capacity.
 */
export const INVERTER_DEFAULT_DESIGN_MARGIN = 0.25;

/**
 * Preferred maximum continuous utilization of an inverter.
 *
 * 0.80 = 80% of rated continuous power.
 */
export const INVERTER_CONTINUOUS_UTILIZATION_LIMIT = 0.80;

/**
 * Warning threshold for inverter utilization.
 *
 * 0.90 = 90% of rated power.
 */
export const INVERTER_WARNING_UTILIZATION_LIMIT = 0.90;

/**
 * Maximum nominal utilization before the inverter is considered
 * fully loaded in a generic calculation.
 */
export const INVERTER_MAX_UTILIZATION_LIMIT = 1.0;

/**
 * Common DC input system voltages.
 */
export const INVERTER_STANDARD_DC_INPUT_VOLTAGES = [
  12,
  24,
  48,
  96,
] as const;

/**
 * Common AC output voltages.
 */
export const INVERTER_STANDARD_AC_OUTPUT_VOLTAGES = [
  120,
  208,
  220,
  230,
  240,
  380,
  400,
  415,
  440,
  480,
] as const;

/**
 * Default generic surge-capacity multiplier.
 *
 * 1.5 = 150% of continuous capacity.
 *
 * Actual inverter surge capability must be supplied by the
 * equipment specification.
 */
export const INVERTER_DEFAULT_SURGE_MARGIN = 1.5;

/**
 * Default inverter reserve fraction.
 *
 * 0.20 = 20% reserve.
 */
export const INVERTER_DEFAULT_RESERVE_FRACTION = 0.20;

/**
 * Default reference ambient temperature for generic inverter
 * calculations.
 */
export const INVERTER_REFERENCE_TEMPERATURE_C = 25;

/**
 * Common nominal output frequency values.
 */
export const INVERTER_STANDARD_FREQUENCIES_HZ = [
  50,
  60,
] as const;