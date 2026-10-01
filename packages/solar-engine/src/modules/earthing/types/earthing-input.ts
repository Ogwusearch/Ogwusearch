export type EarthingMode =
  | "AC"
  | "DC";

export interface EarthingElectricalInput {
  /**
   * Fault current used for earth-conductor sizing.
   */
  readonly faultCurrentA: number;

  /**
   * Fault-clearing time in seconds.
   */
  readonly faultClearingTimeS: number;

  /**
   * Conductor constant used by the selected
   * earth-conductor sizing model.
   *
   * Units:
   * A·√s/mm²
   */
  readonly conductorConstantA_SqrtS_PerMm2: number;

  /**
   * Soil resistivity.
   *
   * Units:
   * Ω·m
   */
  readonly resistivityOhmM?: number;

  /**
   * Earth-electrode length.
   *
   * Units:
   * m
   */
  readonly electrodeLengthM?: number;

  /**
   * Earth-electrode diameter.
   *
   * Units:
   * m
   */
  readonly electrodeDiameterM?: number;
}

export interface EarthingDesignInput {
  /**
   * Additional design margin expressed as a ratio.
   */
  readonly designMargin?: number;

  /**
   * Bonding-conductor sizing factor.
   */
  readonly bondingConductorFactor?: number;

  /**
   * Maximum acceptable earth resistance.
   *
   * Units:
   * Ω
   */
  readonly earthResistanceTargetOhm?: number;
}

export interface EarthingInput {
  readonly mode: EarthingMode;

  readonly electrical: EarthingElectricalInput;

  readonly design?: EarthingDesignInput;
}