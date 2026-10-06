export interface LoadPeakDemandInput {
  readonly loadId: string;
  readonly runningPowerW: number;
  readonly demandFactor?: number;
  readonly startingPowerW?: number;
  readonly surgeFactor?: number;
}

export interface LoadPeakDemandResult {
  readonly loadId: string;
  readonly runningPowerW: number;
  readonly demandFactor: number;
  readonly individualDemandW: number;
  readonly startingPowerW: number;
  readonly surgeFactor: number;
  readonly startingDemandW: number;
}

export interface LoadPeakDemandOutput {
  readonly totalRunningPowerW: number;
  readonly totalIndividualDemandW: number;
  readonly diversityFactor: number;
  readonly normalCoincidentDemandW: number;
  readonly startingDemandW: number;
  readonly peakDemandW: number;
  readonly demandMargin: number;
  readonly designPeakDemandW: number;
  readonly loads: readonly LoadPeakDemandResult[];
}

const DEFAULT_DEMAND_FACTOR = 1;
const DEFAULT_DIVERSITY_FACTOR = 1;
const DEFAULT_SURGE_FACTOR = 1;
const DEFAULT_DEMAND_MARGIN = 0;

export function calculateLoadPeakDemand(
  inputs: readonly LoadPeakDemandInput[],
  diversityFactor = DEFAULT_DIVERSITY_FACTOR,
  demandMargin = DEFAULT_DEMAND_MARGIN,
): LoadPeakDemandOutput {
  let totalRunningPowerW = 0;
  let totalIndividualDemandW = 0;

  const loads: LoadPeakDemandResult[] =
    inputs.map((load) => {
      const resolvedDemandFactor =
        load.demandFactor ??
        DEFAULT_DEMAND_FACTOR;

      const resolvedSurgeFactor =
        load.surgeFactor ??
        DEFAULT_SURGE_FACTOR;

      const individualDemandW =
        load.runningPowerW *
        resolvedDemandFactor;

      const startingDemandW =
        load.startingPowerW !== undefined
          ? load.startingPowerW
          : load.runningPowerW *
            resolvedSurgeFactor;

      totalRunningPowerW +=
        load.runningPowerW;

      totalIndividualDemandW +=
        individualDemandW;

      return {
        loadId: load.loadId,
        runningPowerW:
          load.runningPowerW,
        demandFactor:
          resolvedDemandFactor,
        individualDemandW,
        startingPowerW:
          load.startingPowerW ??
          load.runningPowerW,
        surgeFactor:
          resolvedSurgeFactor,
        startingDemandW,
      };
    });

  const normalCoincidentDemandW =
    totalIndividualDemandW /
    diversityFactor;

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
    peakDemandW *
    (1 + demandMargin);

  return {
    totalRunningPowerW,
    totalIndividualDemandW,
    diversityFactor,
    normalCoincidentDemandW,
    startingDemandW,
    peakDemandW,
    demandMargin,
    designPeakDemandW,
    loads,
  };
}
