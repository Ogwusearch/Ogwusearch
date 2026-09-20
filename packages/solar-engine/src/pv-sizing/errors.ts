import type { EngineeringMessage } from "./types";

export const createPVSizingError = (
  code: string,
  field: string,
  message: string,
  value?: unknown,
): EngineeringMessage => ({
  code,
  field,
  message,
  ...(value !== undefined ? { value } : {}),
});

export const pvSizingErrors = {
  invalidDailyEnergy: (value: unknown): EngineeringMessage =>
    createPVSizingError(
      "PV_SIZING_INVALID_DAILY_ENERGY",
      "dailyEnergyKWh",
      "dailyEnergyKWh must be a finite number greater than 0.",
      value,
    ),

  invalidPeakSunHours: (value: unknown): EngineeringMessage =>
    createPVSizingError(
      "PV_SIZING_INVALID_PEAK_SUN_HOURS",
      "peakSunHours",
      "peakSunHours must be a finite number greater than 0.",
      value,
    ),

  invalidSystemEfficiency: (value: unknown): EngineeringMessage =>
    createPVSizingError(
      "PV_SIZING_INVALID_SYSTEM_EFFICIENCY",
      "systemEfficiency",
      "systemEfficiency must be a finite number greater than 0 and less than or equal to 1.",
      value,
    ),

  invalidPanelPower: (value: unknown): EngineeringMessage =>
    createPVSizingError(
      "PV_SIZING_INVALID_PANEL_POWER",
      "panelPowerW",
      "panelPowerW must be a finite number greater than 0 when provided.",
      value,
    ),
};