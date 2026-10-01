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

  readonly quantity: number;

  readonly ratedPowerW: number;

  readonly powerFactor: number;

  readonly efficiency?: number;

  readonly operatingHoursPerDay: number;

  readonly operatingDaysPerMonth: number;

  /**
   * Per-load demand factor consumed by Peak Demand.
   */
  readonly demandFactor?: number;

  readonly phase: LoadPhase;

  readonly description?: string;
}
