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