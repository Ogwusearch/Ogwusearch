export interface ChargeControllerSizingValue {
  readonly pvChargingCurrentA: number;
  readonly controllerOutputCurrentA: number;
  readonly requiredControllerCurrentA: number;
  readonly requiredControllerPowerW: number;

  readonly controllerRatedCurrentA?: number;
  readonly controllerCurrentMarginA?: number;
  readonly currentCompatible?: boolean;

  readonly voltageCompatible?: boolean;
  readonly mpptCompatible?: boolean;

  readonly pvArrayImpA?: number;
  readonly pvArrayIscA?: number;
  readonly pvCurrentMarginA?: number;
  readonly pvCurrentCompatible?: boolean;

  readonly systemCompatible?: boolean;
}
