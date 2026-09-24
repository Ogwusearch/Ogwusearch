import type { EngineeringId } from "./identifier.js";

/**
 * Common metadata attached to engineering calculations
 * and other engineering artifacts.
 */
export interface EngineeringMetadata {
  /**
   * Unique identifier of the calculation or artifact.
   */
  readonly id?: EngineeringId;

  /**
   * Package/module that produced the result.
   *
   * Example:
   * "@ogwusearch/solar-engine"
   */
  readonly module?: string;

  /**
   * Version of the producing module.
   */
  readonly version?: string;

  /**
   * Optional project identifier.
   */
  readonly projectId?: EngineeringId;

  /**
   * Optional audit identifier.
   */
  readonly auditId?: EngineeringId;

  /**
   * Optional descriptive name.
   */
  readonly name?: string;

  /**
   * Arbitrary non-domain metadata.
   */
  readonly tags?: readonly string[];

  /**
   * Additional metadata that does not belong
   * in the core engineering result.
   */
  readonly extras?: Readonly<Record<string, unknown>>;
}