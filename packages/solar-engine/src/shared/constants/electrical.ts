/**
 * Common electrical engineering constants.
 *
 * This module contains reusable reference values only.
 * It does not perform calculations or validation.
 */

/**
 * Common nominal single-phase AC system voltages in volts.
 */
export const SINGLE_PHASE_VOLTAGES = [
  120,
  208,
  220,
  230,
  240,
] as const;

/**
 * Common nominal three-phase AC system voltages in volts.
 */
export const THREE_PHASE_VOLTAGES = [
  380,
  400,
  415,
  440,
  480,
] as const;

/**
 * Common DC system voltages used in renewable-energy systems.
 */
export const DC_SYSTEM_VOLTAGES = [
  12,
  24,
  48,
  96,
] as const;

/**
 * Common nominal utility frequency values in hertz.
 */
export const NOMINAL_FREQUENCIES = [
  50,
  60,
] as const;

/**
 * Square root of three used in balanced three-phase calculations.
 */
export const SQRT_3 = Math.sqrt(3);

/**
 * Default power factor used when an explicit power factor
 * is not supplied to a generic calculation.
 *
 * 0.90 = 90%
 */
export const POWER_FACTOR_DEFAULT = 0.9;

/**
 * Lower practical bound for generic power-factor calculations.
 */
export const POWER_FACTOR_MIN = 0.5;

/**
 * Upper mathematical limit for power factor.
 */
export const POWER_FACTOR_MAX = 1.0;

/**
 * Continuous-load design factor.
 *
 * 1.25 = 125% of the continuous operating value.
 *
 * This is a calculation/reference factor, not a universal
 * compliance rule. Applicable standards must be evaluated
 * by the relevant domain validation.
 */
export const CONTINUOUS_LOAD_FACTOR = 1.25;

/**
 * Default motor starting/surge factor.
 */
export const MOTOR_SURGE_FACTOR_DEFAULT = 3;

/**
 * Upper reference value for generic motor surge calculations.
 */
export const MOTOR_SURGE_FACTOR_MAX = 7;

/**
 * Common nominal frequency in Nigeria and many other 50 Hz
 * electrical systems.
 */
export const NIGERIA_NOMINAL_FREQUENCY_HZ = 50;

/**
 * Common nominal low-voltage three-phase values used in
 * Nigerian electrical installations.
 *
 * These are reference values only and must not be treated
 * as universal equipment or grid requirements.
 */
export const NIGERIA_THREE_PHASE_VOLTAGES = [
  380,
  400,
  415,
] as const;

/**
 * Common nominal single-phase values used in Nigerian
 * electrical installations.
 */
export const NIGERIA_SINGLE_PHASE_VOLTAGES = [
  220,
  230,
  240,
] as const;