// ============================================================
// Solar Engine
// Individual Load Calculation
// ============================================================

import type { Load } from "../types/load.js";
import type { LoadResult } from "../types/load-output.js";

import {
  LOAD_DEFAULTS,
} from "../constants.js";

export function calculateLoad(
  load: Load,
): LoadResult {
  const efficiency =
    load.efficiency ??
    LOAD_DEFAULTS.efficiency;

  const connectedLoadW =
    load.quantity *
    load.ratedPowerW;

  const runningLoadW =
    connectedLoadW /
    efficiency;

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
