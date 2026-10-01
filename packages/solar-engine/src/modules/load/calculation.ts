// ============================================================
// Solar Engine
// Load Audit Calculation
//
// Load owns load characterization.
// Energy owns energy analysis.
// Peak Demand owns demand analysis.
//
// This function composes those domain calculations.
// ============================================================

import type {
  LoadAuditInput,
  LoadAuditOutput,
  LoadResult,
} from "./types/index.js";

import {
  calculateLoad,
} from "./calculation/index.js";

import {
  LOAD_DEFAULTS,
} from "./constants.js";

import {
  PEAK_DEMAND_DEFAULTS,
} from "../peak-demand/constants.js";

import {
  calculatePeakDemand,
} from "../peak-demand/calculation/index.js";

import {
  calculateEnergy,
} from "../energy/calculation.js";

export function calculateLoadAudit(
  input: LoadAuditInput,
): LoadAuditOutput {
  const designMargin =
    input.designMargin ??
    LOAD_DEFAULTS.designMargin;

  const diversityFactor =
    input.diversityFactor ??
    PEAK_DEMAND_DEFAULTS.diversityFactor;

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

  const totalApparentPowerVA =
    loads.reduce(
      (total, load) =>
        total + load.apparentPowerVA,
      0,
    );

  const peakDemand =
    calculatePeakDemand({
      diversityFactor,
      demandMargin: designMargin,

      loads: input.loads.map(
        (load, index) => {
          const calculatedLoad =
            loads[index];

          if (calculatedLoad === undefined) {
            throw new Error(
              `Unable to map Load "${load.id}" to Peak Demand input.`,
            );
          }

          return {
            loadId: load.id,
            runningPowerW:
              calculatedLoad.runningLoadW,

            ...(load.demandFactor !== undefined && {
              demandFactor:
                load.demandFactor,
            }),
          };
        },
      ),
    });

  const energy =
    calculateEnergy({
      loads: input.loads.map(
        (load, index) => {
          const calculatedLoad =
            loads[index];

          if (calculatedLoad === undefined) {
            throw new Error(
              `Unable to map Load "${load.id}" to Energy input.`,
            );
          }

          return {
            loadId: load.id,
            runningLoadW:
              calculatedLoad.runningLoadW,
            operatingHoursPerDay:
              load.operatingHoursPerDay,
            operatingDaysPerMonth:
              load.operatingDaysPerMonth,
          };
        },
      ),
    });

  return {
    loads,

    totalConnectedLoadW,

    totalRunningLoadW,

    totalDemandLoadW:
      peakDemand.normalCoincidentDemandW,

    totalApparentPowerVA,

    dailyEnergyWh:
      energy.totalDailyEnergyWh,

    monthlyEnergyWh:
      energy.totalMonthlyEnergyWh,

    peakDemandW:
      peakDemand.peakDemandW,

    designMargin:
      peakDemand.demandMargin,

    designPeakDemandW:
      peakDemand.designPeakDemandW,
  };
}
