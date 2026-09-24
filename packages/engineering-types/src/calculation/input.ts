/**
 * Base contract for engineering calculation inputs.
 *
 * Domain packages such as solar-engine extend this interface
 * with their own calculation-specific fields.
 */
export interface CalculationInput {
  /**
   * Optional caller-provided metadata.
   *
   * This should not contain calculation logic.
   */
  readonly metadata?: Record<string, unknown>;
}