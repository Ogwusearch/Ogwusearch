export function calculateAnnualEnergy(
  monthlyEnergyWh: number,
): number {
  return (
    monthlyEnergyWh *
    12
  );
}
