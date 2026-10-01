import type { SolarEngineeringAssumptions } from "./engineering-assumptions.js";

/**
 * Default engineering assumptions for the solar engine.
 *
 * These defaults represent conservative design assumptions for
 * residential and small commercial PV systems and may be overridden
 * on a per-calculation basis.
 */
export const DEFAULT_SOLAR_ENGINEERING_ASSUMPTIONS: Readonly<SolarEngineeringAssumptions> =
  Object.freeze({
    // Solar resource
    peakSunHours: 5,

    // System efficiencies
    performanceRatio: 0.75,
    inverterEfficiency: 0.95,
    batteryRoundTripEfficiency: 0.90,

    // Battery assumptions
    batteryDepthOfDischarge: 0.50,
    batteryAutonomyDays: 1,

    // Design margins
    pvDesignMargin: 0.25,
    batteryDesignMargin: 0.20,
    inverterDesignMargin: 0.25,
    controllerDesignMargin: 0.25,

    // Cable allowance
    cableLossAllowance: 0.03,

    // Temperature assumptions
    ambientTemperatureC: 25,
    minimumTemperatureC: -10,
    maximumTemperatureC: 45,
  });

/**
 * Merge user-provided assumptions with defaults.
 */
export function resolveSolarEngineeringAssumptions(
  overrides: Partial<SolarEngineeringAssumptions> = {},
): SolarEngineeringAssumptions {
  return {
    ...DEFAULT_SOLAR_ENGINEERING_ASSUMPTIONS,
    ...overrides,
  };
}