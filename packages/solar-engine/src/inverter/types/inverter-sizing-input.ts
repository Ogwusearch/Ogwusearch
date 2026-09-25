export interface InverterSizingInput {
  /**
   * Continuous AC load power required by the connected loads.
   */
  continuousLoadW: number;

  /**
   * Maximum AC load power expected during startup or transient surge.
   */
  surgeLoadW: number;

  /**
   * DC battery/system voltage supplied to the inverter.
   */
  systemVoltageV: number;

  /**
   * Inverter efficiency represented as a decimal.
   * Example: 0.92 = 92%.
   */
  inverterEfficiency: number;

  /**
   * Optional load power factor.
   * Example: 0.8 = 80%.
   */
  powerFactor?: number;

  /**
   * Optional inverter continuous AC output rating.
   */
  inverterRatedPowerW?: number;

  /**
   * Optional inverter surge AC output rating.
   */
  inverterSurgePowerW?: number;

  /**
   * Optional inverter acceptable DC input voltage minimum.
   */
  inverterInputVoltageMinV?: number;

  /**
   * Optional inverter acceptable DC input voltage maximum.
   */
  inverterInputVoltageMaxV?: number;

  /**
   * Optional required AC output voltage.
   */
  requiredOutputVoltageV?: number;

  /**
   * Optional inverter AC output voltage.
   */
  inverterOutputVoltageV?: number;
}