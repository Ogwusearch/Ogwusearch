// ============================================================
// Solar Engine
// Load Domain Constants
// ============================================================

export const LOAD_DEFAULTS = {
  /**
   * Equipment efficiency used when a load does not
   * explicitly provide one.
   */
  efficiency: 1,

  /**
   * Load Audit demand design margin.
   */
  designMargin: 0.2,
} as const;

export const LOAD_LIMITS = {
  maximumOperatingHoursPerDay: 24,
  maximumOperatingDaysPerMonth: 31,
  minimumPowerFactor: 0,
  maximumPowerFactor: 1,
} as const;
