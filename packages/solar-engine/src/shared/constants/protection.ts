/**
 * Electrical protection engineering constants.
 *
 * This module contains reusable reference values and design factors.
 * It does not select protection devices or determine compliance.
 *
 * Applicable standards and equipment-specific requirements must be
 * evaluated by the appropriate protection and validation modules.
 */

/**
 * Generic overcurrent protection design factor.
 *
 * 1.25 = 125% of the calculated operating current.
 */
export const OVERCURRENT_PROTECTION_FACTOR = 1.25;

/**
 * Common PV string overcurrent protection design factor.
 *
 * 1.56 = 156% of the reference PV short-circuit current.
 *
 * This is a reference calculation factor and must not be treated
 * as a universal compliance rule.
 */
export const PV_STRING_FUSE_FACTOR = 1.56;

/**
 * Common nominal circuit-breaker current ratings in amperes.
 *
 * These values are a reference list for protection-selection
 * calculations. Actual device availability and applicable
 * standards must be checked separately.
 */
export const BREAKER_STANDARD_RATINGS = [
  2,
  4,
  6,
  10,
  16,
  20,
  25,
  32,
  40,
  50,
  63,
  80,
  100,
  125,
  160,
  200,
  250,
  315,
  400,
] as const;

/**
 * Common nominal fuse ratings in amperes.
 *
 * This list is used as a reference for selecting the next
 * appropriate protection rating in domain calculations.
 */
export const FUSE_STANDARD_RATINGS = [
  2,
  4,
  6,
  10,
  15,
  20,
  25,
  30,
  35,
  40,
  50,
  63,
  80,
  100,
  125,
  160,
  200,
] as const;

/**
 * Preferred maximum design utilization for circuit breakers.
 *
 * 0.80 = 80%.
 */
export const MAX_BREAKER_UTILIZATION = 0.8;

/**
 * Preferred maximum design utilization for fuses.
 *
 * 0.80 = 80%.
 */
export const MAX_FUSE_UTILIZATION = 0.8;

/**
 * Minimum reference protection-current margin.
 *
 * Represents the ratio between the selected protection rating
 * and the calculated design current.
 */
export const MIN_PROTECTION_MARGIN = 1.0;

/**
 * Maximum reference protection-current oversizing factor.
 *
 * This is deliberately only a calculation reference and should
 * not replace conductor/equipment coordination requirements.
 */
export const MAX_PROTECTION_OVERSIZE_FACTOR = 2.0;

/**
 * Common PV fuse voltage classes in volts.
 *
 * Reference values only; actual PV protection devices must be
 * selected using the system maximum voltage and applicable standard.
 */
export const PV_FUSE_VOLTAGE_CLASSES = [
  500,
  600,
  800,
  1000,
  1100,
  1500,
] as const;

/**
 * Common DC breaker voltage classes in volts.
 */
export const DC_BREAKER_VOLTAGE_CLASSES = [
  60,
  100,
  150,
  250,
  500,
  600,
  800,
  1000,
  1500,
] as const;