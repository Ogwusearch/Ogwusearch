// ============================================================
// @ogwusearch/solar-engine
// Load Domain
// ============================================================

export type LoadCategory =
  | "LIGHTING"
  | "HVAC"
  | "MOTOR"
  | "PUMP"
  | "APPLIANCE"
  | "OFFICE"
  | "IT"
  | "INDUSTRIAL"
  | "OTHER";

export type LoadPhase =
  | "SINGLE_PHASE"
  | "THREE_PHASE";

export interface Load {
  readonly id: string;
  readonly name: string;
  readonly category: LoadCategory;

  /**
   * Number of identical units.
   */
  readonly quantity: number;

  /**
   * Rated electrical power per unit in watts.
   */
  readonly ratedPowerW: number;

  /**
   * Power factor, normally 0 < PF <= 1.
   */
  readonly powerFactor: number;

  /**
   * Equipment efficiency, normally 0 < efficiency <= 1.
   */
  readonly efficiency?: number;

  /**
   * Operating hours per day.
   */
  readonly operatingHoursPerDay: number;

  /**
   * Operating days per month.
   */
  readonly operatingDaysPerMonth: number;

  /**
   * Demand factor, normally 0 < factor <= 1.
   */
  readonly demandFactor?: number;

  /**
   * Diversity factor, normally >= 1.
   */
  readonly diversityFactor?: number;

  readonly phase: LoadPhase;

  readonly description?: string;
}