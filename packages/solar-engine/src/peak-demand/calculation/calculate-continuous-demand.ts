export function calculateContinuousDemand(
  runningPowerW: number,
  demandFactor: number,
): number {
  return runningPowerW * demandFactor;
}
