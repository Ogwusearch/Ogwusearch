import type { CalculationOutput } from "@ogwusearch/engineering-types";

export interface PeakDemandLoadResult {
  readonly loadId: string;
  readonly runningPowerW: number;
  readonly demandFactor: number;
  readonly individualDemandW: number;
  readonly startingPowerW: number;
  readonly surgeFactor: number;
  readonly startingDemandW: number;
}

export interface PeakDemandOutput extends CalculationOutput {
  readonly totalRunningPowerW: number;
  readonly totalIndividualDemandW: number;
  readonly diversityFactor: number;
  readonly normalCoincidentDemandW: number;
  readonly startingDemandW: number;
  readonly peakDemandW: number;
  readonly peakDemandKW: number;
  readonly demandMargin: number;
  readonly designPeakDemandW: number;
  readonly designPeakDemandKW: number;
  readonly loads: readonly PeakDemandLoadResult[];
}
