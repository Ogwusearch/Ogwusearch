/**
 * Represents one step in an engineering calculation trace.
 *
 * A trace step explains how part of a calculation was performed,
 * making the final result inspectable and auditable.
 */
export interface CalculationTraceStep {
  /**
   * Stable identifier for this trace step.
   *
   * Example:
   * "PV_SIZE_REQUIRED_POWER"
   */
  readonly id: string;

  /**
   * Human-readable name for the step.
   *
   * Example:
   * "Calculate Required PV Power"
   */
  readonly name: string;

  /**
   * Optional explanation of what this step does.
   */
  readonly description?: string;

  /**
   * Optional engineering formula used by the step.
   *
   * Example:
   * "dailyEnergyWh / peakSunHours / systemEfficiency"
   */
  readonly formula?: string;

  /**
   * Input values used during this step.
   */
  readonly inputs?: Record<string, unknown>;

  /**
   * Output values produced by this step.
   */
  readonly outputs?: Record<string, unknown>;

  /**
   * Optional unit associated with the primary result.
   *
   * Example:
   * "W"
   */
  readonly unit?: string;

  /**
   * Optional execution order.
   */
  readonly sequence?: number;

  /**
   * Optional additional information about the step.
   */
  readonly metadata?: Record<string, unknown>;
}