import {
  PEAK_DEMAND_DEFAULTS,
  WATTS_PER_KILOWATT,
} from "../constants.js";

import type {
  PeakDemandInput,
  PeakDemandOutput,
  PeakDemandLoadResult,
} from "../types/index.js";

import {
  calculateContinuousDemand,
} from "./calculate-continuous-demand.js";

import {
  calculateStartingDemand,
} from "./calculate-starting-demand.js";

import {
  calculateDesignDemand,
} from "./calculate-design-demand.js";

export function calculatePeakDemand(
  input: PeakDemandInput,
): PeakDemandOutput {
  const diversityFactor =
    input.diversityFactor ??
    PEAK_DEMAND_DEFAULTS.diversityFactor;

  const demandMargin =
    input.demandMargin ??
    PEAK_DEMAND_DEFAULTS.demandMargin;

  let totalRunningPowerW = 0;
  let totalIndividualDemandW = 0;

  const loads: PeakDemandLoadResult[] =
    input.loads.map((load) => {
      const demandFactor =
        load.demandFactor ??
        PEAK_DEMAND_DEFAULTS.demandFactor;

      const surgeFactor =
        load.surgeFactor ??
        PEAK_DEMAND_DEFAULTS.surgeFactor;

      const individualDemandW =
        calculateContinuousDemand(
          load.runningPowerW,
          demandFactor,
        );

      const startingDemandW =
        calculateStartingDemand(
          load.runningPowerW,
          load.startingPowerW,
          surgeFactor,
        );

      totalRunningPowerW +=
        load.runningPowerW;

      totalIndividualDemandW +=
        individualDemandW;

      return {
        loadId: load.loadId,
        runningPowerW: load.runningPowerW,
        demandFactor,
        individualDemandW,
        startingPowerW:
          load.startingPowerW ??
          load.runningPowerW,
        surgeFactor,
        startingDemandW,
      };
    });

  const normalCoincidentDemandW =
    totalIndividualDemandW /
    diversityFactor;

  /*
   * Starting demand is represented as a
   * system scenario. The starting contribution
   * replaces the normal demand contribution of
   * the starting load rather than being blindly
   * added to the entire system demand.
   *
   * The conservative multi-start scenario will
   * be refined when explicit scenario semantics
   * are added to the contract.
   */
  const startingDemandW =
    Math.max(
      ...loads.map(
        (load) =>
          normalCoincidentDemandW +
          Math.max(
            0,
            load.startingDemandW -
              load.individualDemandW,
          ),
      ),
    );

  const peakDemandW =
    Math.max(
      normalCoincidentDemandW,
      startingDemandW,
    );

  const designPeakDemandW =
    calculateDesignDemand(
      peakDemandW,
      demandMargin,
    );

  return {
    totalRunningPowerW,
    totalIndividualDemandW,
    diversityFactor,
    normalCoincidentDemandW,
    startingDemandW,
    peakDemandW,
    peakDemandKW:
      peakDemandW / WATTS_PER_KILOWATT,
    demandMargin,
    designPeakDemandW,
    designPeakDemandKW:
      designPeakDemandW /
      WATTS_PER_KILOWATT,
    loads,
  };
}
