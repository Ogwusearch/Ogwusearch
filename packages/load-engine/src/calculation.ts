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
  calculateLoadEnergy,
} from "./calculation/energy/calculate-load-energy.js";

import {
  calculateLoadPeakDemand,
} from "./calculation/peak-demand/calculate-peak-demand.js";

export function calculateLoadAudit(
  input: LoadAuditInput,
): LoadAuditOutput {
  const designMargin =
    input.designMargin ??
    LOAD_DEFAULTS.designMargin;

  const diversityFactor =
    input.diversityFactor ??
    1;

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

  const energy =
    calculateLoadEnergy(
      input.loads.map(
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
    );

  const peakDemand =
    calculateLoadPeakDemand(
      input.loads.map(
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
      diversityFactor,
      designMargin,
    );

  return {
    loads,

    totalConnectedLoadW,

    totalRunningLoadW,

    normalCoincidentDemandW:
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
