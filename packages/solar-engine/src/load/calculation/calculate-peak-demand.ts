// ============================================================
// Peak Demand Calculation
// ============================================================

import type {
  LoadResult,
} from "../types/load-output.js";

export function calculatePeakDemand(
  results: readonly LoadResult[],
): {
  readonly peakDemandW: number;
  readonly peakDemandVA: number;
} {
  const peakDemandW = results.reduce(
    (total, load) =>
      total + load.demandLoadW,
    0,
  );

  const peakDemandVA = results.reduce(
    (total, load) =>
      total + load.apparentPowerVA,
    0,
  );

  return {
    peakDemandW,
    peakDemandVA,
  };
}