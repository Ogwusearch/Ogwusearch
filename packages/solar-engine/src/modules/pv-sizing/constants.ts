export const PV_SIZING_CONSTANTS = {
  minDailyEnergyKWh: 0,
  minPeakSunHours: 0,
  minSystemEfficiency: 0,
  maxSystemEfficiency: 1,
  minPanelPowerW: 0,

  // Peak sun hours below this value may require engineering review.
  lowPeakSunHours: 3,

  defaultPrecision: 3,
} as const;

export type PVSizingConstants =
  typeof PV_SIZING_CONSTANTS;