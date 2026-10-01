/**
 * Photovoltaic engineering constants.
 *
 * This module contains reusable PV reference values only.
 * It does not perform calculations, validation, equipment selection,
 * or standards compliance checks.
 */

/**
 * Standard reference irradiance used for PV test conditions.
 *
 * Unit:
 *   W/m²
 */
export const PV_REFERENCE_IRRADIANCE = 1000;

/**
 * Standard reference PV cell temperature.
 *
 * Unit:
 *   °C
 */
export const PV_REFERENCE_CELL_TEMPERATURE = 25;

/**
 * Reference ambient temperature associated with common PV
 * reference-condition calculations.
 *
 * Unit:
 *   °C
 */
export const PV_REFERENCE_AMBIENT_TEMPERATURE = 20;

/**
 * Default PV performance ratio.
 *
 * Decimal ratio:
 *   0.75 = 75%
 */
export const PV_DEFAULT_PERFORMANCE_RATIO = 0.75;

/**
 * Default PV design margin.
 *
 * Decimal ratio:
 *   0.25 = 25%
 */
export const PV_DEFAULT_DESIGN_MARGIN = 0.25;

/**
 * Default equivalent peak sun hours per day.
 *
 * Unit:
 *   h/day
 */
export const PV_DEFAULT_PEAK_SUN_HOURS = 5;

/**
 * Minimum reference performance ratio.
 */
export const PV_MIN_PERFORMANCE_RATIO = 0.5;

/**
 * Maximum reference performance ratio.
 *
 * A ratio above 1.0 is normally not physically meaningful
 * for a conventional system-level performance ratio.
 */
export const PV_MAX_PERFORMANCE_RATIO = 1.0;

/**
 * Default PV soiling loss.
 *
 * Decimal loss:
 *   0.03 = 3%
 */
export const PV_DEFAULT_SOILING_LOSS = 0.03;

/**
 * Default PV wiring loss.
 *
 * Decimal loss:
 *   0.02 = 2%
 */
export const PV_DEFAULT_WIRING_LOSS = 0.02;

/**
 * Default PV module mismatch loss.
 *
 * Decimal loss:
 *   0.02 = 2%
 */
export const PV_DEFAULT_MISMATCH_LOSS = 0.02;

/**
 * Default PV temperature-related production loss allowance.
 *
 * Decimal loss:
 *   0.08 = 8%
 */
export const PV_DEFAULT_TEMPERATURE_LOSS = 0.08;

/**
 * Default inverter conversion loss allowance when modeling
 * PV production as an AC output value.
 *
 * Decimal loss:
 *   0.05 = 5%
 */
export const PV_DEFAULT_INVERTER_LOSS = 0.05;

/**
 * Reference upper array-to-inverter DC/AC ratio.
 *
 * Decimal ratio:
 *   1.20 = 120%
 *
 * This is a design reference, not a universal equipment limit.
 */
export const PV_MAX_ARRAY_UTILIZATION = 1.2;

/**
 * Reference array-to-inverter ratio at which a design warning
 * may be appropriate.
 *
 * Decimal ratio:
 *   1.10 = 110%
 */
export const PV_WARNING_ARRAY_UTILIZATION = 1.1;

/**
 * Minimum preferred MPPT utilization ratio.
 *
 * Decimal ratio:
 *   0.70 = 70%
 *
 * This is a design reference rather than a universal inverter
 * requirement.
 */
export const PV_MIN_MPPT_UTILIZATION = 0.7;

/**
 * Common PV system nominal DC voltage levels used as
 * reference values by downstream design modules.
 */
export const PV_COMMON_DC_SYSTEM_VOLTAGES = [
  12,
  24,
  48,
  96,
] as const;

/**
 * Common PV module test-condition irradiance categories.
 *
 * Primarily useful for explicit calculation contracts.
 */
export const PV_STANDARD_TEST_CONDITION = Object.freeze({
  irradianceWPerM2: PV_REFERENCE_IRRADIANCE,
  cellTemperatureC: PV_REFERENCE_CELL_TEMPERATURE,
  ambientTemperatureC: PV_REFERENCE_AMBIENT_TEMPERATURE,
} as const);

/**
 * Common PV loss factors represented as retained fractions.
 *
 * Example:
 *   0.97 = 97% of power retained after a 3% loss.
 */
export const PV_DEFAULT_RETAINED_FACTORS = Object.freeze({
  soiling: 1 - PV_DEFAULT_SOILING_LOSS,
  wiring: 1 - PV_DEFAULT_WIRING_LOSS,
  mismatch: 1 - PV_DEFAULT_MISMATCH_LOSS,
  temperature: 1 - PV_DEFAULT_TEMPERATURE_LOSS,
  inverter: 1 - PV_DEFAULT_INVERTER_LOSS,
} as const);