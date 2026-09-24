// ============================================================
// @ogwusearch/engineering-units
// Conversion Errors
// ============================================================

import type { DimensionVector } from "../dimensions/dimension.js";

/**
 * Error thrown when a conversion cannot be performed.
 */
export class UnitConversionError extends Error {
  readonly code: string;

  constructor(
    message: string,
    code: string = "UNIT_CONVERSION_ERROR",
  ) {
    super(message);

    this.name = "UnitConversionError";
    this.code = code;

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );
  }
}

/**
 * Error thrown when source and target units represent
 * different physical dimensions.
 */
export class IncompatibleUnitError
  extends UnitConversionError
{
  readonly sourceDimension: DimensionVector;
  readonly targetDimension: DimensionVector;

  constructor(
    sourceDimension: DimensionVector,
    targetDimension: DimensionVector,
  ) {
    super(
      `Cannot convert between incompatible dimensions: ` +
      `${formatDimension(sourceDimension)} and ` +
      `${formatDimension(targetDimension)}.`,
      "INCOMPATIBLE_UNIT_DIMENSIONS",
    );

    this.name = "IncompatibleUnitError";
    this.sourceDimension = sourceDimension;
    this.targetDimension = targetDimension;

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );
  }
}

/**
 * Format a dimension vector for an error message.
 */
function formatDimension(
  dimension: DimensionVector,
): string {
  return JSON.stringify(dimension);
}