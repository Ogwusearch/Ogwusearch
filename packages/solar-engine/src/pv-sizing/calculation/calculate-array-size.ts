// ============================================================
// PV Sizing
// Array Size Calculation
// ============================================================

/**
 * Calculates the required PV array power in watts.
 *
 * Existing formula:
 *
 *   requiredPVPowerW =
 *     (requiredPVEnergyKWh / peakSunHours) * 1000
 */
export function calculateArraySizeW(
  requiredPVEnergyKWh: number,
  peakSunHours: number,
): number {
  return (
    requiredPVEnergyKWh / peakSunHours
  ) * 1000;
}

/**
 * Converts required PV array power from watts to kilowatts.
 */
export function calculateArraySizeKW(
  requiredPVPowerW: number,
): number {
  return requiredPVPowerW / 1000;
}