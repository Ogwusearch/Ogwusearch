// ============================================================
// Load Audit Calculation
// ============================================================

import type {
  LoadAuditInput,
  LoadAuditOutput,
  LoadResult,
} from "./types/index.js";

import {
  calculateLoad,
  calculateDailyEnergy,
  calculateMonthlyEnergy,
  calculatePeakDemand,
} from "./calculation/index.js";

import {
  LOAD_DEFAULTS,
} from "./constants.js";

export function calculateLoadAudit(
  input: LoadAuditInput,
): LoadAuditOutput {
  const designMargin =
    input.designMargin ??
    LOAD_DEFAULTS.designMargin;

  const loads: LoadResult[] =
    input.loads.map(calculateLoad);

  const totalConnectedLoadW =
    loads.reduce(
      (total, load) =>
        total + load.connectedLoadW,
      0,
    );

  const totalRunningLoadW =
    loads.reduce(
      (total, load) =>
        total + load.runningLoadW,
      0,
    );

  const totalDemandLoadW =
    loads.reduce(
      (total, load) =>
        total + load.demandLoadW,
      0,
    );

  const totalApparentPowerVA =
    loads.reduce(
      (total, load) =>
        total + load.apparentPowerVA,
      0,
    );

  const dailyEnergyWh =
    calculateDailyEnergy(loads);

  const monthlyEnergyWh =
    calculateMonthlyEnergy(loads);

  const {
    peakDemandW,
    peakDemandVA,
  } = calculatePeakDemand(loads);

  const designPeakDemandW =
    peakDemandW *
    (1 + designMargin);

  const designPeakDemandVA =
    peakDemandVA *
    (1 + designMargin);

  return {
    loads,
    totalConnectedLoadW,
    totalRunningLoadW,
    totalDemandLoadW,
    totalApparentPowerVA,
    dailyEnergyWh,
    monthlyEnergyWh,
    peakDemandW,
    peakDemandVA,
    designMargin,
    designPeakDemandW,
    designPeakDemandVA,
  };
}