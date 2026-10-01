
export interface ChargeControllerSizingInput {
  readonly pvArrayPowerW: number;
  readonly batteryVoltageV: number;
  readonly controllerEfficiency: number;
  readonly safetyMargin: number;

  readonly pvArrayVmpV?: number;
  readonly pvArrayVocV?: number;
  readonly pvArrayImpA?: number;
  readonly pvArrayIscA?: number;

  readonly controllerRatedCurrentA?: number;
  readonly controllerMaxPVVoltageV?: number;
  readonly controllerMPPTMinVoltageV?: number;
  readonly controllerMPPTMaxVoltageV?: number;
  readonly controllerMaxPVCurrentA?: number;
}
