// ============================================================
// @ogwusearch/engineering-units
// Quantity Comparison
// ============================================================

import type { Quantity } from "./quantity.js";

/**
 * Compare two quantities.
 *
 * Quantities must represent the same physical dimension.
 *
 * Returns:
 *   -1 if a < b
 *    0 if a === b
 *    1 if a > b
 */
export function compareQuantities(
  a: Quantity,
  b: Quantity,
): -1 | 0 | 1 {
  if (a.unit.dimension !== b.unit.dimension) {
    throw new Error(
      `Cannot compare quantities with different dimensions: ` +
      `${a.unit.dimension} and ${b.unit.dimension}.`,
    );
  }

  const aBase = a.unit.toBase(a.value);
  const bBase = b.unit.toBase(b.value);

  if (aBase < bBase) {
    return -1;
  }

  if (aBase > bBase) {
    return 1;
  }

  return 0;
}

/**
 * Determine whether two quantities are equal.
 */
export function quantitiesEqual(
  a: Quantity,
  b: Quantity,
): boolean {
  return compareQuantities(a, b) === 0;
}

/**
 * Determine whether quantity a is greater than quantity b.
 */
export function quantityGreaterThan(
  a: Quantity,
  b: Quantity,
): boolean {
  return compareQuantities(a, b) > 0;
}

/**
 * Determine whether quantity a is less than quantity b.
 */
export function quantityLessThan(
  a: Quantity,
  b: Quantity,
): boolean {
  return compareQuantities(a, b) < 0;
}