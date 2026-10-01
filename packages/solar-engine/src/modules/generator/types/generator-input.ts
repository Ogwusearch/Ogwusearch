/**
 * Generator operating phase configuration.
 */
export type GeneratorPhase = 1 | 3;

/**
 * Generator sizing requirement.
 *
 * The requirement must originate from an upstream engineering calculation.
 * Generator does not reconstruct load or peak-demand calculations.
 */
export interface GeneratorRequirement {
  /**
   * Required real power in watts.
   */
  readonly requiredPowerW: number;

  /**
   * Required apparent power in volt-amperes.
   *
   * When supplied, this is authoritative for generator sizing.
   */
  readonly requiredApparentPowerVA?: number;

  /**
   * Starting demand in watts when explicitly supplied by an upstream
   * engineering calculation.
   */
  readonly startingDemandW?: number;

  /**
   * Source/reference identifying the upstream calculation.
   */
  readonly source?: string;
}

/**
 * Optional generator rating supplied for verification.
 *
 * This represents an existing/proposed generator rating.
 * The Generator module must not silently modify it.
 */
export interface GeneratorRating {
  /**
   * Generator apparent-power rating in VA.
   */
  readonly capacityVA: number;

  /**
   * Rated voltage in volts.
   */
  readonly voltageV?: number;

  /**
   * Rated frequency in hertz.
   */
  readonly frequencyHz?: number;

  /**
   * Number of phases.
   */
  readonly phase?: GeneratorPhase;

  /**
   * Rated power factor.
   */
  readonly powerFactor?: number;
}

/**
 * Generator design inputs.
 */
export interface GeneratorDesignInput {
  /**
   * Explicit generator-specific design margin.
   *
   * This must not be confused with an upstream demand margin that may
   * already be incorporated into the requirement.
   */
  readonly designMargin?: number;

  /**
   * Explicit generator power factor.
   */
  readonly powerFactor?: number;
}

/**
 * Generator electrical compatibility requirements.
 */
export interface GeneratorElectricalInput {
  /**
   * Required generator voltage in volts.
   */
  readonly requiredVoltageV?: number;

  /**
   * Required generator frequency in hertz.
   */
  readonly requiredFrequencyHz?: number;

  /**
   * Required number of phases.
   */
  readonly requiredPhase?: GeneratorPhase;
}

/**
 * Complete Generator input contract.
 */
export interface GeneratorInput {
  /**
   * Already-calculated upstream engineering requirement.
   */
  readonly requirement: GeneratorRequirement;

  /**
   * Optional generator rating to verify.
   */
  readonly generator?: GeneratorRating;

  /**
   * Generator-specific design inputs.
   */
  readonly design?: GeneratorDesignInput;

  /**
   * Electrical compatibility requirements.
   */
  readonly electrical?: GeneratorElectricalInput;
}