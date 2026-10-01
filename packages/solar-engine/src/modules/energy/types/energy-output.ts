/**
 * SolarAudit — Energy Analysis
 *
 * Canonical output contracts for Phase 02.
 */

export interface EnergyLoadResult {
  readonly loadId: string;

  readonly dailyEnergyWh: number;
  readonly monthlyEnergyWh: number;
  readonly annualEnergyWh: number;
}

export interface EnergyOutput {
  readonly loads: readonly EnergyLoadResult[];

  readonly totalDailyEnergyWh: number;
  readonly totalDailyEnergyKWh: number;

  readonly totalMonthlyEnergyWh: number;
  readonly totalMonthlyEnergyKWh: number;

  readonly totalAnnualEnergyWh: number;
  readonly totalAnnualEnergyKWh: number;

  readonly adjustedDailyEnergyWh: number;
  readonly adjustedMonthlyEnergyWh: number;
  readonly adjustedAnnualEnergyWh: number;

  readonly designDailyEnergyWh: number;
  readonly designMonthlyEnergyWh: number;
  readonly designAnnualEnergyWh: number;

  /**
   * Energy adjustment factor caused by system losses.
   *
   * 1 means no loss adjustment.
   */
  readonly adjustmentFactor: number;
}
