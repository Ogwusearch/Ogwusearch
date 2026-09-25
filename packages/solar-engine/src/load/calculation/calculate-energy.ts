// ============================================================
// Solar Engine
// Energy Calculation
// ============================================================

import type { LoadResult } from "../types/load-output.js";

export function calculateDailyEnergy(
  results: readonly LoadResult[],
): number {
  return results.reduce(
    (total, load) =>
      total + load.dailyEnergyWh,
    0,
  );
}

export function calculateMonthlyEnergy(
  results: readonly LoadResult[],
): number {
  return results.reduce(
    (total, load) =>
      total + load.monthlyEnergyWh,
    0,
  );
}