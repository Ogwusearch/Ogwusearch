export function calculateDailyEnergy(
  runningLoadW: number,
  operatingHoursPerDay: number,
): number {
  return (
    runningLoadW *
    operatingHoursPerDay
  );
}
