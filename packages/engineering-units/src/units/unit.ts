// ============================================================
// @ogwusearch/engineering-units
// Unit Definition
// ============================================================

import type { DimensionVector } from "../dimensions/dimension.js";

/**
 * Generic engineering unit definition.
 *
 * A unit belongs to a physical dimension and provides the
 * information required to convert values to and from the
 * package's canonical representation.
 */
export interface Unit {
  /**
   * Unique unit symbol.
   *
   * Examples:
   *   m
   *   kg
   *   A
   *   V
   *   W
   *   Ω
   */
  readonly symbol: string;

  /**
   * Human-readable unit name.
   *
   * Examples:
   *   metre
   *   kilogram
   *   ampere
   *   volt
   */
  readonly name: string;

  /**
   * Physical dimension represented by the unit.
   */
  readonly dimension: DimensionVector;

  /**
   * Convert a value from this unit to the canonical unit.
   */
  readonly toBase: (value: number) => number;

  /**
   * Convert a value from the canonical unit to this unit.
   */
  readonly fromBase: (value: number) => number;
}