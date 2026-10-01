// ============================================================
// Solar Engine
// Load Domain Output
// ============================================================

export interface LoadResult {
  readonly loadId: string;

  /**
   * Connected electrical load.
   */
  readonly connectedLoadW: number;

  /**
   * Operating/running electrical load after efficiency.
   */
  readonly runningLoadW: number;

  /**
   * Apparent power derived from running load and power factor.
   */
  readonly apparentPowerVA: number;
}

export interface LoadAuditOutput {
  readonly loads: readonly LoadResult[];

  readonly totalConnectedLoadW: number;

  readonly totalRunningLoadW: number;

  /**
   * Normal coincident demand returned by Peak Demand.
   */
  readonly totalDemandLoadW: number;

  readonly totalApparentPowerVA: number;

  /**
   * Energy totals returned by Energy.
   */
  readonly dailyEnergyWh: number;
  readonly monthlyEnergyWh: number;

  /**
   * Demand results returned by Peak Demand.
   */
  readonly peakDemandW: number;
  readonly designMargin: number;
  readonly designPeakDemandW: number;
}
