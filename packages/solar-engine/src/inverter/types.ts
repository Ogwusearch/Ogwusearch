// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/inverter/types.ts

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

export interface EngineeringMessage {
  code: string;
  field: string;
  message: string;
  value?: unknown;
}

export interface InverterSizingTrace {
  formulas: {
    requiredContinuousOutputPowerW: string;
    requiredSurgeOutputPowerW: string;
    requiredContinuousInputPowerW: string;
    requiredSurgeInputPowerW: string;
    requiredContinuousVA: string;
    requiredContinuousDCInputCurrentA: string;
    requiredSurgeDCInputCurrentA: string;
    continuousMarginW: string;
    surgeMarginW: string;
    continuousCompatible: string;
    surgeCompatible: string;
    inputVoltageCompatible: string;
    outputVoltageCompatible: string;
    systemCompatible: string;
  };

  assumptions: string[];

  calculations: {
    continuousLoadW: number;
    surgeLoadW: number;
    systemVoltageV: number;
    inverterEfficiency: number;

    powerFactor?: number;

    inverterRatedPowerW?: number;
    inverterSurgePowerW?: number;

    inverterInputVoltageMinV?: number;
    inverterInputVoltageMaxV?: number;

    requiredOutputVoltageV?: number;
    inverterOutputVoltageV?: number;

    requiredContinuousOutputPowerW: number;
    requiredSurgeOutputPowerW: number;

    requiredContinuousInputPowerW: number;
    requiredSurgeInputPowerW: number;

    requiredContinuousVA?: number;

    requiredContinuousDCInputCurrentA: number;
    requiredSurgeDCInputCurrentA: number;

    continuousMarginW?: number;
    surgeMarginW?: number;

    continuousCompatible?: boolean;
    surgeCompatible?: boolean;
    inputVoltageCompatible?: boolean;
    outputVoltageCompatible?: boolean;
    systemCompatible?: boolean;
  };
}

export interface InverterSizingResult {
  success: boolean;
  value?: InverterSizingValue;
  errors: EngineeringMessage[];
  warnings: EngineeringMessage[];
  trace?: InverterSizingTrace;

  metadata: {
    engine: "inverter-sizing";
    version: string;
    unitSystem: "SI";
  };
}