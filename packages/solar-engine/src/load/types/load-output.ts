

// ============================================================

// Load Audit Output

// ============================================================

export interface LoadResult {

 readonly loadId: string;

readonly connectedLoadW: number;

readonly runningLoadW: number;

readonly demandLoadW: number;

readonly apparentPowerVA: number;

readonly dailyEnergyWh: number;

readonly monthlyEnergyWh: number;

}

export interface LoadAuditOutput {

readonly loads: readonly LoadResult[];

readonly totalConnectedLoadW: number;

readonly totalRunningLoadW: number;

readonly totalDemandLoadW: number;
readonly totalApparentPowerVA: number;

readonly dailyEnergyWh: number;

readonly monthlyEnergyWh: number;

readonly peakDemandW: number;

readonly peakDemandVA: number;

readonly designMargin: number;

readonly designPeakDemandW: number;

readonly designPeakDemandVA: number;

}