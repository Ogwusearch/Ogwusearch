export type VoltageDropMode =
  | "DC"
  | "AC";

export interface VoltageDropInput {
  /**
   * Electrical calculation mode.
   */
  readonly mode: VoltageDropMode;

  /**
   * Source voltage at the beginning of the circuit.
   */
  readonly sourceVoltageV: number;

  /**
   * Operating current through the circuit.
   */
  readonly operatingCurrentA: number;

  /**
   * Explicit total circuit resistance.
   *
   * When supplied, this is the resistance used by
   * the calculation.
   */
  readonly resistanceOhm?: number;

  /**
   * Total electrical path length represented by the
   * resistance model.
   *
   * This is not automatically doubled.
   *
   * For a two-conductor DC circuit, the caller must
   * supply the complete electrical path length if that
   * is the intended resistance model.
   */
  readonly conductorLengthM?: number;

  /**
   * Conductor cross-sectional area.
   */
  readonly conductorAreaMm2?: number;

  /**
   * Conductor resistivity.
   *
   * Unit:
   * Ω·mm²/m
   */
  readonly resistivityOhmMm2PerM?: number;

  /**
   * Optional allowable voltage-drop limit.
   *
   * Expressed as a percentage.
   *
   * Example:
   * 3 = 3%
   */
  readonly allowableVoltageDropPercent?: number;
}