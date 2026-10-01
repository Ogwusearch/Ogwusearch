/**
 * Solar-engineering design assumptions.
 *
 * Percentage-like values are represented as decimal ratios:
 *
 *   1.00 = 100%
 *   0.95 = 95%
 *   0.75 = 75%
 *   0.50 = 50%
 */
export interface SolarEngineeringAssumptions {
  /**
   * Equivalent full-sun hours per day.
   */
  peakSunHours: number;

  /**
   * PV performance ratio as a decimal fraction [0, 1].
   */
  performanceRatio: number;

  /**
   * Inverter efficiency as a decimal fraction [0, 1].
   */
  inverterEfficiency: number;

  /**
   * Battery round-trip efficiency as a decimal fraction [0, 1].
   */
  batteryRoundTripEfficiency: number;

  /**
   * Battery depth of discharge as a decimal fraction [0, 1].
   */
  batteryDepthOfDischarge: number;

  /**
   * Expected cable loss allowance as a decimal fraction [0, 1].
   */
  cableLossAllowance: number;

  /**
   * PV sizing design margin as a decimal fraction.
   *
   * Example:
   *   0.25 = 25% additional design capacity.
   */
  pvDesignMargin: number;

  /**
   * Battery sizing design margin as a decimal fraction.
   */
  batteryDesignMargin: number;

  /**
   * Inverter sizing design margin as a decimal fraction.
   */
  inverterDesignMargin: number;

  /**
   * Charge-controller sizing design margin as a decimal fraction.
   */
  controllerDesignMargin: number;

  /**
   * Required battery autonomy in days.
   */
  batteryAutonomyDays: number;

  /**
   * Reference ambient temperature in °C.
   */
  ambientTemperatureC: number;

  /**
   * Minimum design temperature in °C.
   */
  minimumTemperatureC: number;

  /**
   * Maximum design temperature in °C.
   */
  maximumTemperatureC: number;
}