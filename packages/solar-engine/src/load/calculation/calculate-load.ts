
// ============================================================
// Solar Engine
// Individual Load Calculation
// ============================================================

import type { Load } from "../types/load.js";
import type { LoadResult } from "../types/load-output.js";
import { LOAD_DEFAULTS } from "../constants.js";

export function calculateLoad(
  load: Load,
): LoadResult {
  const efficiency =
    load.efficiency ??
    LOAD_DEFAULTS.efficiency;

  const demandFactor =
    load.demandFactor ??
    LOAD_DEFAULTS.demandFactor;

  const diversityFactor =
    load.diversityFactor ??
    LOAD_DEFAULTS.diversityFactor;

  const connectedLoadW =
    load.quantity *
    load.ratedPowerW;

  const runningLoadW =
    connectedLoadW /
    efficiency;

  const demandLoadW =
    runningLoadW *
    demandFactor /
    diversityFactor;

  const apparentPowerVA =
    demandLoadW /
    load.powerFactor;

  const dailyEnergyWh =
    runningLoadW *
    load.operatingHoursPerDay;

  const monthlyEnergyWh =
    dailyEnergyWh *
    load.operatingDaysPerMonth;

  return {
    loadId: load.id,
    connectedLoadW,
    runningLoadW,
    demandLoadW,
    apparentPowerVA,
    dailyEnergyWh,
    monthlyEnergyWh,
  };
}
