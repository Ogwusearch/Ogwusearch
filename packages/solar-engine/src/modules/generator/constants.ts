/**
 * Generator module constants.
 *
 * These are reference values only.
 * They must not silently modify supplied engineering requirements.
 */

export const GENERATOR_CONSTANTS = {
  /**
   * Default power factor used only when the input contract explicitly
   * permits a default power factor.
   */
  DEFAULT_POWER_FACTOR: 1,

  /**
   * Minimum valid generator power factor.
   */
  MIN_POWER_FACTOR: 0,

  /**
   * Maximum valid generator power factor.
   */
  MAX_POWER_FACTOR: 1,

  /**
   * Minimum valid design margin.
   */
  MIN_DESIGN_MARGIN: 0,

  /**
   * Maximum design margin accepted by the validation contract.
   *
   * 100% margin is the upper boundary; larger margins should be
   * explicitly reviewed rather than silently accepted.
   */
  MAX_DESIGN_MARGIN: 1,

  /**
   * Minimum valid generator capacity/rating.
   */
  MIN_CAPACITY_VA: 0,

  /**
   * Reference generator frequency.
   */
  REFERENCE_FREQUENCY_HZ: 50,
} as const;

export const GENERATOR_WARNING_CODES = {
  CAPACITY_MARGIN_LOW: "GENERATOR_CAPACITY_MARGIN_LOW",
  UTILIZATION_HIGH: "GENERATOR_UTILIZATION_HIGH",
  POWER_FACTOR_LOW: "GENERATOR_POWER_FACTOR_LOW",
  STARTING_CAPACITY_LOW: "GENERATOR_STARTING_CAPACITY_LOW",
  VOLTAGE_MISMATCH: "GENERATOR_VOLTAGE_MISMATCH",
  FREQUENCY_MISMATCH: "GENERATOR_FREQUENCY_MISMATCH",
  PHASE_MISMATCH: "GENERATOR_PHASE_MISMATCH",
} as const;

export type GeneratorWarningCode =
  (typeof GENERATOR_WARNING_CODES)[keyof typeof GENERATOR_WARNING_CODES];