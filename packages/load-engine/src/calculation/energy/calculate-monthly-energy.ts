export function calculateMonthlyEnergy(
  dailyEnergyWh: number,
  operatingDaysPerMonth: number,
): number {
  return (
    dailyEnergyWh *
    operatingDaysPerMonth
  );
}
