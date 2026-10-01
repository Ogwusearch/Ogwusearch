/**
 * Generic energy engineering relationships.
 *
 * These functions operate on normalized numeric values.
 * Unit representation and conversion belong to
 * @ogwusearch/engineering-units.
 */

/**
 * Calculates energy from power and operating time.
 *
 * E = P × t
 */
export function calculateEnergyWh(
  powerW: number,
  hours: number,
): number {
  return powerW * hours;
}

/**
 * Converts watt-hours to kilowatt-hours.
 */
export function convertWhToKWh(
  energyWh: number,
): number {
  return energyWh / 1000;
}

/**
 * Converts kilowatt-hours to watt-hours.
 */
export function convertKWhToWh(
  energyKWh: number,
): number {
  return energyKWh * 1000;
}

/**
 * Calculates average power from energy and elapsed time.
 *
 * Pavg = E / t
 */
export function calculateAveragePowerW(
  energyWh: number,
  hours: number,
): number {
  return energyWh / hours;
}

/**
 * Sums energy values for the same period and unit.
 */
export function calculateDailyEnergyWh(
  values: readonly number[],
): number {
  return values.reduce(
    (sum, value) => sum + value,
    0,
  );
}
