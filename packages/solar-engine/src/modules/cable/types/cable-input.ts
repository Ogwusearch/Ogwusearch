export type CableMode = "DC" | "AC";

export interface CableConductorOption {
  readonly areaMm2: number;
  readonly allowableAmpacityA: number;
}

export interface CableInput {
  readonly mode: CableMode;

  /**
   * Load real power in watts.
   *
   * Required when operatingCurrentA is not supplied.
   */
  readonly loadPowerW?: number;

  /**
   * Electrical system voltage in volts.
   *
   * Required when operatingCurrentA is not supplied.
   */
  readonly systemVoltageV?: number;

  /**
   * Operating current in amperes.
   *
   * When supplied, this is the primary current input.
   */
  readonly operatingCurrentA?: number;

  /**
   * AC power factor.
   *
   * Required only when AC current is derived
   * from power and voltage.
   */
  readonly powerFactor?: number;

  /**
   * Cable length in metres.
   *
   * Carried as explicit cable data for downstream
   * modules such as Voltage Drop.
   */
  readonly cableLengthM?: number;

  /**
   * Explicit design margin as a ratio.
   *
   * Example:
   * 0.20 = 20 %
   */
  readonly designMargin: number;

  /**
   * Conductor material selected explicitly by the caller.
   */
  readonly conductorMaterial: string;

  /**
   * Conductor resistivity in Ω·mm²/m.
   */
  readonly resistivityOhmMm2PerM?: number;

  /**
   * Number of conductors used by the cable configuration.
   */
  readonly conductorCount: number;

  /**
   * Explicit deterministic conductor selection table.
   *
   * The smallest area whose allowable ampacity satisfies
   * the required ampacity is selected.
   */
  readonly conductorOptions: readonly CableConductorOption[];

  /**
   * Explicit installation method.
   */
  readonly installationMethod?: string;
}