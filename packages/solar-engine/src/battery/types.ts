export interface BatterySizingInput {
  dailyEnergyKWh: number;
  autonomyDays: number;
  systemVoltageV: number;
  depthOfDischarge: number;
  batteryEfficiency: number;
  designMargin: number;
  batteryUnitVoltageV?: number;
  batteryUnitCapacityAh?: number;
}

export interface BatterySizingValue {
  requiredBatteryEnergyKWh: number;
  adjustedBatteryEnergyKWh: number;
  requiredBatteryCapacityAh: number;

  batteryUnitVoltageV?: number;
  batteryUnitCapacityAh?: number;

  seriesBatteries?: number;
  parallelStrings?: number;
  totalBatteryUnits?: number;

  installedBatteryCapacityAh?: number;
  installedBatteryEnergyKWh?: number;
}

export interface EngineeringMessage {
  code: string;
  field: string;
  message: string;
  value?: unknown;
}

export interface BatterySizingTrace {
  formulas: {
    requiredBatteryEnergyKWh: string;
    adjustedBatteryEnergyKWh: string;
    requiredBatteryCapacityAh: string;
    seriesBatteries: string;
    parallelStrings: string;
    totalBatteryUnits: string;
    installedBatteryCapacityAh: string;
    installedBatteryEnergyKWh: string;
  };

  assumptions: string[];

  calculations: {
    dailyEnergyKWh: number;
    autonomyDays: number;
    systemVoltageV: number;
    depthOfDischarge: number;
    batteryEfficiency: number;
    designMargin: number;

    batteryUnitVoltageV?: number;
    batteryUnitCapacityAh?: number;

    requiredBatteryEnergyKWh: number;
    adjustedBatteryEnergyKWh: number;
    requiredBatteryCapacityAh: number;

    seriesBatteries?: number;
    parallelStrings?: number;
    totalBatteryUnits?: number;

    installedBatteryCapacityAh?: number;
    installedBatteryEnergyKWh?: number;
  };
}

export interface BatterySizingResult {
  success: boolean;
  value?: BatterySizingValue;
  errors: EngineeringMessage[];
  warnings: EngineeringMessage[];
  trace?: BatterySizingTrace;

  metadata: {
    engine: "battery-sizing";
    version: string;
    unitSystem: "SI";
  };
}