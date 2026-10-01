export function calculateStartingDemand(
  runningPowerW: number,
  startingPowerW: number | undefined,
  surgeFactor: number,
): number {
  if (startingPowerW !== undefined) {
    return startingPowerW;
  }

  return runningPowerW * surgeFactor;
}
