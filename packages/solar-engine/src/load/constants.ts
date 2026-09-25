// ============================================================
// Load Constants
// ============================================================

export const LOAD_DEFAULTS = {
  powerFactor: 1,
  efficiency: 1,
  demandFactor: 1,
  diversityFactor: 1,
  designMargin: 0.2,
} as const;

export const LOAD_LIMITS = {
  maximumOperatingHoursPerDay: 24,
  maximumOperatingDaysPerMonth: 31,
  minimumPowerFactor: 0,
  maximumPowerFactor: 1,
} as const;