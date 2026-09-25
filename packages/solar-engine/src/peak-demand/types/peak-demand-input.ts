export interface PeakDemandLoadInput {
  readonly loadId: string;
  readonly runningPowerW: number;
  readonly demandFactor?: number;
  readonly startingPowerW?: number;
  readonly surgeFactor?: number;
  readonly powerFactor?: number;
}

export interface PeakDemandInput {
  readonly loads: readonly PeakDemandLoadInput[];
  readonly diversityFactor?: number;
  readonly demandMargin?: number;
}
