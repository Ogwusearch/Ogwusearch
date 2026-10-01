/**
 * Peak-sun-hour and solar-irradiation formulas.
 *
 * These functions are pure mathematical helpers.
 * Validation of irradiance, area, duration, and reference values
 * belongs to the appropriate domain/validation layer.
 *
 * Units:
 * - Irradiance: W/m²
 * - Irradiation: Wh/m²
 * - Area: m²
 * - Time: h
 * - Peak sun hours: h
 */

import { PV_REFERENCE_IRRADIANCE } from "../constants/pv.js";

/**
 * Calculates peak sun hours from daily solar irradiation.
 *
 * Formula:
 *   PSH = H / Gref
 *
 * Where:
 *   H    = daily irradiation in Wh/m²
 *   Gref = reference irradiance in W/m²
 */
export function calculatePeakSunHours(
  dailyIrradiationWhPerM2: number,
  referenceIrradianceWPerM2 = PV_REFERENCE_IRRADIANCE,
): number {
  return (
    dailyIrradiationWhPerM2 /
    referenceIrradianceWPerM2
  );
}

/**
 * Calculates daily irradiation from peak sun hours.
 *
 * Formula:
 *   H = PSH × Gref
 */
export function calculateDailyIrradiationWhPerM2(
  peakSunHours: number,
  referenceIrradianceWPerM2 = PV_REFERENCE_IRRADIANCE,
): number {
  return (
    peakSunHours *
    referenceIrradianceWPerM2
  );
}

/**
 * Calculates incident solar energy on a surface.
 *
 * Formula:
 *   E = G × A × t
 *
 * Where:
 *   G = irradiance in W/m²
 *   A = area in m²
 *   t = duration in hours
 *
 * Result:
 *   Wh
 */
export function calculateIncidentSolarEnergyWh(
  irradianceWPerM2: number,
  areaM2: number,
  hours: number,
): number {
  return (
    irradianceWPerM2 *
    areaM2 *
    hours
  );
}

/**
 * Calculates peak sun hours from irradiance samples.
 *
 * Each sample is assumed to represent the average irradiance
 * over the supplied sample interval.
 *
 * Formula:
 *   H = Σ(Gi × Δt)
 *   PSH = H / Gref
 */
export function calculatePeakSunHoursFromSamples(
  irradianceSamplesWPerM2: readonly number[],
  sampleIntervalHours: number,
  referenceIrradianceWPerM2 = PV_REFERENCE_IRRADIANCE,
): number {
  const dailyIrradiationWhPerM2 =
    irradianceSamplesWPerM2.reduce(
      (total, irradianceWPerM2) =>
        total +
        irradianceWPerM2 *
          sampleIntervalHours,
      0,
    );

  return calculatePeakSunHours(
    dailyIrradiationWhPerM2,
    referenceIrradianceWPerM2,
  );
}

/**
 * Calculates the solar energy received over a period
 * from an average irradiance.
 *
 * Formula:
 *   E = G × A × t
 */
export function calculateSolarEnergyWh(
  averageIrradianceWPerM2: number,
  areaM2: number,
  hours: number,
): number {
  return calculateIncidentSolarEnergyWh(
    averageIrradianceWPerM2,
    areaM2,
    hours,
  );
}