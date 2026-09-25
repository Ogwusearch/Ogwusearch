export interface InverterSizingValue {
  /**
   * Continuous AC output power required by the loads.
   */
  requiredContinuousOutputPowerW: number;

  /**
   * Surge AC output power required by the loads.
   */
  requiredSurgeOutputPowerW: number;

  /**
   * Estimated DC input power required during continuous operation.
   */
  requiredContinuousInputPowerW: number;

  /**
   * Estimated DC input power required during surge operation.
   */
  requiredSurgeInputPowerW: number;

  /**
   * Required continuous apparent power when power factor is supplied.
   */
  requiredContinuousVA?: number;

  /**
   * Estimated DC input current during continuous operation.
   */
  requiredContinuousDCInputCurrentA: number;

  /**
   * Estimated DC input current during surge operation.
   */
  requiredSurgeDCInputCurrentA: number;

  /**
   * Optional inverter continuous AC output rating.
   */
  inverterRatedPowerW?: number;

  /**
   * Optional inverter surge AC output rating.
   */
  inverterSurgePowerW?: number;

  /**
   * Difference between inverter continuous rating and continuous load.
   */
  continuousMarginW?: number;

  /**
   * Difference between inverter surge rating and surge load.
   */
  surgeMarginW?: number;

  /**
   * Whether the inverter continuous rating can support the load.
   */
  continuousCompatible?: boolean;

  /**
   * Whether the inverter surge rating can support the surge load.
   */
  surgeCompatible?: boolean;

  /**
   * Whether the DC system voltage is within the inverter input range.
   */
  inputVoltageCompatible?: boolean;

  /**
   * Whether the inverter AC output voltage matches the required voltage.
   */
  outputVoltageCompatible?: boolean;

  /**
   * Overall compatibility result from the supplied compatibility checks.
   */
  systemCompatible?: boolean;
}