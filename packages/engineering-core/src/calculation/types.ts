import type {
  CalculationContext as SharedCalculationContext,
  CalculationResult,
  CalculationStatus,
  EngineeringAssumption,
  EngineeringIssue,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import type { TraceContext } from "../trace/trace-context.js";

export type {
  CalculationResult,
  CalculationStatus,
  EngineeringAssumption,
  EngineeringWarning,
};

export type CalculationContext =
  SharedCalculationContext;

/**
 * Runtime execution context supplied to a calculation.
 *
 * The shared engineering CalculationContext remains the
 * authoritative public contract. Core enriches it with trace
 * infrastructure during execution.
 */
export type CalculationExecutionContext =
  CalculationContext & {
    readonly trace: TraceContext;
  };

/**
 * Defines the lifecycle contract for an engineering calculation.
 *
 * Lifecycle:
 *
 * validate
 *      ↓
 * assumptions
 *      ↓
 * calculate
 *      ↓
 * warnings
 *      ↓
 * CalculationResult
 */
export interface CalculationDefinition<
  TInput,
  TOutput,
> {
  /**
   * Unique calculation name.
   */
  readonly name: string;

  /**
   * Validates calculation input.
   *
   * Returns blocking errors and optional warnings.
   */
  readonly validate?: (
    input: TInput,
  ) => EngineeringIssue[];

  /**
   * Provides explicit engineering assumptions.
   */
  readonly assumptions?:
    | EngineeringAssumption[]
    | ((
        input: TInput,
      ) => EngineeringAssumption[]);

  /**
   * Generates non-blocking engineering warnings.
   *
   * Warnings do not stop calculation execution.
   *
   * Examples:
   *
   * - low solar resource
   * - high losses
   * - large design margin
   * - unusual engineering conditions
   */
  readonly warnings?:
    | EngineeringWarning[]
    | ((
        input: TInput,
        output: TOutput,
      ) => EngineeringWarning[]);

  /**
   * Performs the deterministic engineering calculation.
   */
  readonly calculate: (
    input: TInput,
    context: CalculationExecutionContext,
  ) => TOutput;
}