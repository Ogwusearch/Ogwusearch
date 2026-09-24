import type { EngineeringAssumption } from "../assumptions/assumption.js";
import type { EngineeringError } from "../validation/error.js";
import type { EngineeringWarning } from "../validation/warning.js";
import type { CalculationTrace } from "../trace/trace.js";
import type { EngineeringMetadata } from "../common/metadata.js";
import type { CalculationStatus } from "./status.js";
import type { CalculationOutput } from "./output.js";

/**
 * Standardized result returned by an engineering calculation.
 *
 * Every domain engine should return this structure.
 */
export interface CalculationResult<
  TOutput extends CalculationOutput = CalculationOutput,
> {
  /**
   * Overall calculation status.
   */
  readonly status: CalculationStatus;

  /**
   * True when the calculation completed without
   * blocking validation errors.
   */
  readonly valid: boolean;

  /**
   * Calculated domain result.
   *
   * Undefined when the calculation fails validation
   * or execution fails.
   */
  readonly value?: TOutput;

  /**
   * Blocking validation or execution errors.
   */
  readonly errors: EngineeringError[];

  /**
   * Non-blocking engineering warnings.
   */
  readonly warnings: EngineeringWarning[];

  /**
   * Assumptions used during the calculation.
   */
  readonly assumptions: EngineeringAssumption[];

  /**
   * Calculation trace.
   */
  readonly trace: CalculationTrace;

  /**
   * Calculation metadata.
   */
  readonly metadata: EngineeringMetadata;
}