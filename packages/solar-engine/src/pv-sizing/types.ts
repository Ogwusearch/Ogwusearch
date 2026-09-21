import type { EngineeringMetadata } from "@ogwusearch/engineering-types";

export interface PVSizingInput {
  dailyEnergyKWh: number;
  peakSunHours: number;
  systemEfficiency: number;
  panelPowerW?: number;
}

export interface PVSizingValue {
  requiredPVPowerW: number;
  requiredPVPowerKW: number;
  requiredPVEnergyKWh: number;

  panelPowerW?: number;
  requiredPanelCount?: number;

  installedPVCapacityW?: number;
  installedPVCapacityKW?: number;

  oversizingW?: number;
  oversizingKW?: number;
  oversizingRatio?: number;
  oversizingPercent?: number;
}

export interface PVSizingCalculationContext {
  metadata?: EngineeringMetadata;
}