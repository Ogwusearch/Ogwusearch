export interface BatterySizingOutput {
  readonly requiredBatteryEnergyKWh: number;
  readonly adjustedBatteryEnergyKWh: number;
  readonly requiredBatteryCapacityAh: number;

  readonly batteryUnitVoltageV?: number;
  readonly batteryUnitCapacityAh?: number;

  readonly seriesBatteries?: number;
  readonly parallelStrings?: number;
  readonly totalBatteryUnits?: number;

  readonly installedBatteryCapacityAh?: number;
  readonly installedBatteryEnergyKWh?: number;
}