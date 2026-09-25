export function calculatePVEnergy(
  dailyEnergyKWh: number,
  systemEfficiency: number,
): number {
  // Energy that must be supplied by the PV system
  // after accounting for system losses.
  return dailyEnergyKWh / systemEfficiency;
}