// ============================================================
// Solar Engine
//
// Individual Load Calculation
// ============================================================

import type { Load } from "../types/load.js";
import type { LoadResult } from "../types/load-output.js";

export function calculateLoad(
  load: Load,
): LoadResult {
  const connectedLoadW =
    load.quantity *
    load.ratedPowerW;

  const runningLoadW =
    connectedLoadW;

  const apparentPowerVA =
    runningLoadW /
    load.powerFactor;

  return {
    loadId: load.id,
    connectedLoadW,
    runningLoadW,
    apparentPowerVA,
  };
}