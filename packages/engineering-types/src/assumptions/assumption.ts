/**
 * Represents an explicit assumption used by an engineering calculation.
 *
 * Assumptions make calculation inputs and design decisions traceable.
 */
export interface EngineeringAssumption {
  /**
   * Stable identifier for the assumption.
   *
   * Example:
   * "PEAK_SUN_HOURS"
   */
  readonly code: string;

  /**
   * Human-readable assumption name.
   *
   * Example:
   * "Peak Sun Hours"
   */
  readonly name: string;

  /**
   * Assumed value.
   *
   * Can be numeric, textual, boolean, or structured data.
   */
  readonly value: unknown;

  /**
   * Unit associated with the value, when applicable.
   *
   * Examples:
   * "h/day"
   * "%"
   * "V"
   * "kWh"
   */
  readonly unit?: string;

  /**
   * Explanation of why the assumption is being used.
   */
  readonly description?: string;

  /**
   * Source of the assumption.
   *
   * Examples:
   * "User input"
   * "Project configuration"
   * "Engineering standard"
   * "Design default"
   */
  readonly source?: string;

  /**
   * Optional reference to a standard, document,
   * configuration, or other supporting source.
   */
  readonly reference?: string;
}