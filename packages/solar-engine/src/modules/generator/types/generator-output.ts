import type {
  GeneratorPhase,
  GeneratorInput,
} from "./generator-input.js";

/**
 * Generator capacity requirement.
 */
export interface GeneratorCapacity {
  /**
   * Required real power in watts.
   */
  readonly requiredPowerW: number;

  /**
   * Required apparent power in VA.
   */
  readonly requiredApparentPowerVA: number;

  /**
   * Generator-specific design margin applied, if any.
   */
  readonly designMargin?: number;

  /**
   * Power factor used to derive apparent power, when applicable.
   */
  readonly powerFactor?: number;
}

/**
 * Generator capacity margin.
 */
export interface GeneratorCapacityMargin {
  /**
   * Selected/rated generator capacity in VA.
   */
  readonly generatorCapacityVA: number;

  /**
   * Required generator capacity in VA.
   */
  readonly requiredCapacityVA: number;

  /**
   * Absolute capacity margin in VA.
   */
  readonly marginVA: number;

  /**
   * Capacity margin as a fraction of the requirement.
   */
  readonly marginFraction: number;

  /**
   * Generator utilization as a fraction of rated capacity.
   */
  readonly utilization: number;
}

/**
 * Generator compatibility result.
 */
export interface GeneratorCompatibility {
  readonly capacityCompatible?: boolean;
  readonly voltageCompatible?: boolean;
  readonly frequencyCompatible?: boolean;
  readonly phaseCompatible?: boolean;
  readonly powerFactorCompatible?: boolean;
}

/**
 * Complete Generator output.
 */
export interface GeneratorOutput {
  /**
   * Original generator input.
   *
   * Kept as an explicit reference to the engineering requirement used.
   */
  readonly requirement: GeneratorInput["requirement"];

  /**
   * Calculated generator capacity requirement.
   */
  readonly capacity: GeneratorCapacity;

  /**
   * Capacity verification when a generator rating was supplied.
   */
  readonly capacityMargin?: GeneratorCapacityMargin;

  /**
   * Supplied generator rating, when present.
   */
  readonly generatorCapacityVA?: number;

  /**
   * Electrical compatibility results.
   */
  readonly compatibility?: GeneratorCompatibility;

  /**
   * Supplied generator voltage.
   */
  readonly generatorVoltageV?: number;

  /**
   * Supplied generator frequency.
   */
  readonly generatorFrequencyHz?: number;

  /**
   * Supplied generator phase.
   */
  readonly generatorPhase?: GeneratorPhase;
}