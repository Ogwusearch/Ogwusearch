/**
 * Battery-system engineering constants.
 *
 * Values in this module are domain reference values.
 * They are not substitutes for manufacturer-specific battery data.
 *
 * Fractional values use the range [0, 1]:
 *
 *   1.00 = 100%
 *   0.90 = 90%
 *   0.50 = 50%
 */

export const BATTERY_SYSTEM_VOLTAGES = [
  12,
  24,
  48,
] as const;

/**
 * Common default depth of discharge.
 */
export const BATTERY_DEFAULT_DEPTH_OF_DISCHARGE = 0.50;

/**
 * Common default round-trip efficiency.
 */
export const BATTERY_DEFAULT_ROUND_TRIP_EFFICIENCY = 0.90;

/**
 * Default battery autonomy period.
 */
export const BATTERY_DEFAULT_AUTONOMY_DAYS = 1;

/**
 * Default battery sizing margin.
 */
export const BATTERY_DEFAULT_DESIGN_MARGIN = 0.20;

/**
 * Lower practical depth-of-discharge reference.
 *
 * This is a domain reference limit, not a universal
 * manufacturer requirement.
 */
export const BATTERY_MIN_DEPTH_OF_DISCHARGE = 0.20;

/**
 * Upper practical depth-of-discharge reference.
 *
 * Actual allowable DoD depends on battery chemistry
 * and manufacturer specifications.
 */
export const BATTERY_MAX_DEPTH_OF_DISCHARGE = 0.95;

/**
 * Lower reference bound for battery efficiency.
 */
export const BATTERY_MIN_EFFICIENCY = 0.50;

/**
 * Physical upper bound for efficiency.
 */
export const BATTERY_MAX_EFFICIENCY = 1.00;

/**
 * Default reference battery temperature.
 */
export const BATTERY_DEFAULT_TEMPERATURE_C = 25;

/**
 * Nominal voltage of one lead-acid battery cell.
 *
 * Used for conventional 2 V-cell battery-bank relationships.
 */
export const BATTERY_REFERENCE_CELL_VOLTAGE = 2;

/**
 * Typical cell counts associated with common nominal
 * lead-acid battery system voltages.
 */
export const BATTERY_CELL_COUNTS = Object.freeze({
  "12V": 6,
  "24V": 12,
  "48V": 24,
} as const);

/**
 * Common nominal voltage labels.
 */
export const BATTERY_VOLTAGE_LABELS = Object.freeze({
  "12V": 12,
  "24V": 24,
  "48V": 48,
} as const);