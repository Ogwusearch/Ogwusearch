export function calculateDesignDemand(
  peakDemandW: number,
  demandMargin: number,
): number {
  return peakDemandW * (1 + demandMargin);
}
