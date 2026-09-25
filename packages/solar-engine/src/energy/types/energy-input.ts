/**
 * SolarAudit — Energy Analysis
 *
 * Canonical input contract for Phase 02.
 *
 * Energy Analysis does not own the Load domain.
 * It receives the load characteristics required to calculate energy.
 */

export interface EnergyLoadInput {
  /**
   * Identifier of the originating load.
   */
  readonly loadId: string;

  /**
   * Running electrical load in watts.
   */
  readonly runningLoadW: number;

  /**
   * Operating time per day.
   */
  readonly operatingHoursPerDay: number;

  /**
   * Number of operating days per month.
   */
  readonly operatingDaysPerMonth: number;
}

export interface EnergyInput {
  /**
   * Load projections supplied by Load Audit.
   */
  readonly loads: readonly EnergyLoadInput[];

  /**
   * Fraction of supplied energy lost by the system.
   *
   * Example:
   * 0.15 = 15% loss.
   *
   * The resulting adjustment factor is:
   *
   * 1 / (1 - systemLossFactor)
   */
  readonly systemLossFactor?: number;

  /**
   * Additional design margin.
   *
   * Example:
   * 0.20 = 20%.
   */
  readonly designMargin?: number;
}
