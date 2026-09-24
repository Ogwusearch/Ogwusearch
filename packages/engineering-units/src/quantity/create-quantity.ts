// ============================================================
// @ogwusearch/engineering-units
// Quantity Factory
// ============================================================

import type { Unit } from "../units/unit.js";
import type { Quantity } from "./quantity.js";

/**
 * Create a physical quantity.
 *
 * @param value Numeric value.
 * @param unit Unit associated with the value.
 */
export function createQuantity(
  value: number,
  unit: Unit,
): Quantity {
  if (!Number.isFinite(value)) {
    throw new Error("Quantity value must be a finite number.");
  }

  return {
    value,
    unit,
  };
}