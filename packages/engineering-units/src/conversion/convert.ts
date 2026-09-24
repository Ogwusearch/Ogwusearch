// ============================================================
// @ogwusearch/engineering-units
// Conversion Helpers
// ============================================================

import type { Unit } from "../units/unit.js";
import type { Quantity } from "../quantity/quantity.js";
import {
  convertQuantity,
  convertValue,
} from "./conversion.js";

/**
 * Convert a numeric value between units.
 */
export function convert(
  value: number,
  from: Unit,
  to: Unit,
): number {
  return convertValue(value, from, to);
}

/**
 * Convert a quantity to a target unit.
 */
export function convertTo(
  quantity: Quantity,
  targetUnit: Unit,
): Quantity {
  return convertQuantity(quantity, targetUnit);
}