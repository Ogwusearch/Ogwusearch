// ============================================================
// @ogwusearch/engineering-units
// Quantity
// ============================================================

import type { Unit } from "../units/unit.js";

/**
 * A physical quantity consisting of a numeric value and a unit.
 *
 * Examples:
 *   230 V
 *   5 A
 *   2.5 kW
 *   100 Ah
 */
export interface Quantity {
  readonly value: number;
  readonly unit: Unit;
}

/**
 * Type guard for Quantity.
 */
export function isQuantity(value: unknown): value is Quantity {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.value === "number" &&
    Number.isFinite(candidate.value) &&
    typeof candidate.unit === "object" &&
    candidate.unit !== null
  );
}