// ============================================================
// @ogwusearch/engineering-units
// Conversion
// ============================================================

import type { Unit } from "../units/unit.js";
import type { Quantity } from "../quantity/quantity.js";
import { dimensionsEqual } from "../dimensions/dimension.js";
import { IncompatibleUnitError } from "./errors.js";

/**
 * Convert a numeric value from one unit to another.
 *
 * Conversion occurs through the canonical base representation:
 *
 *   source value
 *        ↓
 *   source.toBase()
 *        ↓
 *   canonical value
 *        ↓
 *   target.fromBase()
 *        ↓
 *   target value
 */
export function convertValue(
  value: number,
  from: Unit,
  to: Unit,
): number {
  if (!Number.isFinite(value)) {
    throw new Error(
      "Value to convert must be a finite number.",
    );
  }

  if (
    !dimensionsEqual(
      from.dimension,
      to.dimension,
    )
  ) {
    throw new IncompatibleUnitError(
      from.dimension,
      to.dimension,
    );
  }

  const baseValue = from.toBase(value);

  return to.fromBase(baseValue);
}

/**
 * Convert a quantity to another unit.
 */
export function convertQuantity(
  quantity: Quantity,
  targetUnit: Unit,
): Quantity {
  const value = convertValue(
    quantity.value,
    quantity.unit,
    targetUnit,
  );

  return {
    value,
    unit: targetUnit,
  };
}