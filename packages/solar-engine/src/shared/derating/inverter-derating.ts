/**
 * Inverter derating and usable-capacity calculations.
 *
 * These functions are pure mathematical helpers.
 * Input validation and equipment-specific compliance rules belong
 * to the inverter domain and validation layers.
 *
 * Capacity unit:
 * - Power: Watts (W)
 */

/**
 * Applies a temperature derating factor to inverter rated power.
 *
 * Formula:
 *   Pderated = Prated × temperatureFactor
 *
 * Example:
 *   5000 W × 0.90 = 4500 W
 */
export function applyInverterTemperatureDerating(
  ratedPowerW: number,
  temperatureFactor: number,
): number {
  return ratedPowerW * temperatureFactor;
}

/**
 * Applies an altitude derating factor to inverter rated power.
 *
 * Formula:
 *   Pderated = Prated × altitudeFactor
 */
export function applyInverterAltitudeDerating(
  ratedPowerW: number,
  altitudeFactor: number,
): number {
  return ratedPowerW * altitudeFactor;
}

/**
 * Applies a reserve/headroom requirement to inverter rated power.
 *
 * Formula:
 *   Pusable = Prated × (1 - reserveFraction)
 *
 * Example:
 *   5000 W with 20% reserve = 4000 W usable design capacity.
 */
export function applyInverterHeadroom(
  ratedPowerW: number,
  reserveFraction = 0.2,
): number {
  return ratedPowerW * (1 - reserveFraction);
}

/**
 * Applies an inverter utilization limit.
 *
 * Formula:
 *   Pusable = Prated × utilizationLimit
 *
 * Example:
 *   5000 W × 0.90 = 4500 W.
 */
export function applyInverterUtilizationLimit(
  ratedPowerW: number,
  utilizationLimit = 0.9,
): number {
  return ratedPowerW * utilizationLimit;
}

/**
 * Applies multiple inverter derating factors.
 *
 * Factors represent retained capacity:
 *
 *   1.00 = 100%
 *   0.95 = 95%
 *   0.90 = 90%
 *
 * Reserve is represented separately as a fraction removed
 * from the available capacity.
 */
export function applyInverterDerating(
  ratedPowerW: number,
  factors: {
    temperature?: number;
    altitude?: number;
    reserve?: number;
    utilization?: number;
  },
): number {
  const environmentalCapacityW =
    ratedPowerW *
    (factors.temperature ?? 1) *
    (factors.altitude ?? 1);

  const reserveAdjustedCapacityW =
    environmentalCapacityW *
    (1 - (factors.reserve ?? 0));

  return reserveAdjustedCapacityW *
    (factors.utilization ?? 1);
}

/**
 * Calculates the combined environmental derating factor.
 *
 * Does not apply reserve or utilization limits.
 */
export function calculateInverterEnvironmentalFactor(
  factors: {
    temperature?: number;
    altitude?: number;
  },
): number {
  return (
    (factors.temperature ?? 1) *
    (factors.altitude ?? 1)
  );
}

/**
 * Calculates available inverter capacity after environmental
 * derating only.
 */
export function calculateInverterAvailablePowerW(
  ratedPowerW: number,
  factors: {
    temperature?: number;
    altitude?: number;
  },
): number {
  return (
    ratedPowerW *
    calculateInverterEnvironmentalFactor(factors)
  );
}

/**
 * Calculates inverter capacity after applying an explicit reserve.
 */
export function calculateInverterPowerWithReserveW(
  availablePowerW: number,
  reserveFraction: number,
): number {
  return availablePowerW * (1 - reserveFraction);
}

/**
 * Calculates the inverter power corresponding to a utilization limit.
 */
export function calculateInverterPowerAtUtilizationW(
  ratedPowerW: number,
  utilizationLimit: number,
): number {
  return ratedPowerW * utilizationLimit;
}