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

export interface EngineeringMessage {
  code: string;
  field: string;
  message: string;
  value?: unknown;
}

export interface PVSizingTrace {
  formulas: {
    requiredPVEnergyKWh: string;
    requiredPVPowerW: string;
    requiredPVPowerKW: string;
    requiredPanelCount: string;
    installedPVCapacityW: string;
    oversizingW: string;
    oversizingRatio: string;
    oversizingPercent: string;
  };

  assumptions: string[];

  calculations: {
    dailyEnergyKWh: number;
    peakSunHours: number;
    systemEfficiency: number;

    panelPowerW?: number;

    requiredPVEnergyKWh: number;
    requiredPVPowerW: number;
    requiredPVPowerKW: number;

    requiredPanelCount?: number;

    installedPVCapacityW?: number;
    installedPVCapacityKW?: number;

    oversizingW?: number;
    oversizingKW?: number;
    oversizingRatio?: number;
    oversizingPercent?: number;
  };
}

export interface PVSizingResult {
  success: boolean;

  value?: PVSizingValue;

  errors: EngineeringMessage[];

  warnings: EngineeringMessage[];

  trace?: PVSizingTrace;

  metadata: {
    engine: "pv-sizing";
    version: string;
    unitSystem: "SI";
  };
}
