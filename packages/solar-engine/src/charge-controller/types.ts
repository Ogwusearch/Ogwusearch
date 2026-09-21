// Charge controller sizing types
// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/charge-controller/types.ts

export interface ChargeControllerSizingInput {
  /**
   * Total PV array rated power.
   */
  pvArrayPowerW: number;

  /**
   * Nominal battery/system voltage.
   */
  batteryVoltageV: number;

  /**
   * Charge-controller efficiency represented as a decimal.
   * Example: 0.98 = 98%.
   */
  controllerEfficiency: number;

  /**
   * Additional controller sizing margin represented as a decimal.
   * Example: 0.25 = 25%.
   */
  safetyMargin: number;

  /**
   * Optional PV array operating voltage at maximum power point.
   */
  pvArrayVmpV?: number;

  /**
   * Optional PV array open-circuit voltage.
   */
  pvArrayVocV?: number;

  /**
   * Optional PV array operating current at maximum power point.
   */
  pvArrayImpA?: number;

  /**
   * Optional PV array short-circuit current.
   */
  pvArrayIscA?: number;

  /**
   * Optional controller continuous charge-current rating.
   */
  controllerRatedCurrentA?: number;

  /**
   * Optional maximum PV input voltage accepted by the controller.
   */
  controllerMaxPVVoltageV?: number;

  /**
   * Optional minimum MPPT operating voltage.
   */
  controllerMPPTMinVoltageV?: number;

  /**
   * Optional maximum MPPT operating voltage.
   */
  controllerMPPTMaxVoltageV?: number;

  /**
   * Optional controller maximum PV input current.
   */
  controllerMaxPVCurrentA?: number;
}

export interface ChargeControllerSizingValue {
  /**
   * Estimated PV charging current before controller losses.
   */
  pvChargingCurrentA: number;

  /**
   * Estimated battery-side charging current after controller losses.
   */
  controllerOutputCurrentA: number;

  /**
   * Required controller current including safety margin.
   */
  requiredControllerCurrentA: number;

  /**
   * Controller current margin when a controller rating is supplied.
   */
  controllerCurrentMarginA?: number;

  /**
   * Whether the controller current rating can support the array.
   */
  currentCompatible?: boolean;

  /**
   * Whether PV open-circuit voltage is within the controller limit.
   */
  voltageCompatible?: boolean;

  /**
   * Whether the PV operating voltage is within the MPPT range.
   */
  mpptCompatible?: boolean;

  /**
   * Whether PV operating current is within the controller limit.
   */
  pvCurrentCompatible?: boolean;

  /**
   * Whether all supplied compatibility checks pass.
   */
  systemCompatible?: boolean;

  /**
   * Optional controller rated current.
   */
  controllerRatedCurrentA?: number;

  /**
   * Optional calculated PV operating current.
   */
  pvArrayImpA?: number;

  /**
   * Optional calculated or supplied PV short-circuit current.
   */
  pvArrayIscA?: number;

  /**
   * Optional PV-side current margin against controller limit.
   */
  pvCurrentMarginA?: number;

  /**
   * Optional estimated required controller power.
   */
  requiredControllerPowerW?: number;
}

export interface EngineeringMessage {
  code: string;
  field: string;
  message: string;
  value?: unknown;
}

export interface ChargeControllerSizingTrace {
  formulas: {
    pvChargingCurrentA: string;
    controllerOutputCurrentA: string;
    requiredControllerCurrentA: string;
    requiredControllerPowerW: string;
    controllerCurrentMarginA: string;
    currentCompatible: string;
    voltageCompatible: string;
    mpptCompatible: string;
    pvCurrentCompatible: string;
    systemCompatible: string;
  };

  assumptions: string[];

  calculations: {
    pvArrayPowerW: number;
    batteryVoltageV: number;
    controllerEfficiency: number;
    safetyMargin: number;

    pvArrayVmpV?: number;
    pvArrayVocV?: number;
    pvArrayImpA?: number;
    pvArrayIscA?: number;

    controllerRatedCurrentA?: number;
    controllerMaxPVVoltageV?: number;
    controllerMPPTMinVoltageV?: number;
    controllerMPPTMaxVoltageV?: number;
    controllerMaxPVCurrentA?: number;

    pvChargingCurrentA: number;
    controllerOutputCurrentA: number;
    requiredControllerCurrentA: number;

    requiredControllerPowerW?: number;
    controllerCurrentMarginA?: number;

    currentCompatible?: boolean;
    voltageCompatible?: boolean;
    mpptCompatible?: boolean;
    pvCurrentCompatible?: boolean;
    systemCompatible?: boolean;
  };
}

export interface ChargeControllerSizingResult {
  success: boolean;
  value?: ChargeControllerSizingValue;
  errors: EngineeringMessage[];
  warnings: EngineeringMessage[];
  trace?: ChargeControllerSizingTrace;

  metadata: {
    engine: "charge-controller-sizing";
    version: string;
    unitSystem: "SI";
  };
}