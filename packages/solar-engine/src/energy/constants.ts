// ============================================================
// Solar Engine
// Energy Analysis Constants
// ============================================================

export const ENERGY_DEFAULTS: {
  readonly systemLossFactor: number;
  readonly designMargin: number;
  readonly monthsPerYear: number;
  readonly wattHoursPerKilowattHour: number;
  readonly maxOperatingDaysPerMonth: number;
  readonly maxOperatingHoursPerDay: number;
} = {
  systemLossFactor: 0,
  designMargin: 0,
  monthsPerYear: 12,
  wattHoursPerKilowattHour: 1000,
  maxOperatingDaysPerMonth: 31,
  maxOperatingHoursPerDay: 24,
};
