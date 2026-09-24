// ============================================================
// @ogwusearch/engineering-units
// Dimension
// ============================================================

/**
 * Fundamental SI dimensions used by the engineering unit system.
 */
export interface DimensionVector {
  readonly length: number;
  readonly mass: number;
  readonly time: number;
  readonly temperature: number;
  readonly current: number;
  readonly amount: number;
  readonly luminousIntensity: number;
}

/**
 * Create a dimension vector.
 */
export function createDimension(
  values: Partial<DimensionVector> = {},
): DimensionVector {
  return {
    length: values.length ?? 0,
    mass: values.mass ?? 0,
    time: values.time ?? 0,
    temperature: values.temperature ?? 0,
    current: values.current ?? 0,
    amount: values.amount ?? 0,
    luminousIntensity: values.luminousIntensity ?? 0,
  };
}

/**
 * Check whether two dimensions are identical.
 */
export function dimensionsEqual(
  a: DimensionVector,
  b: DimensionVector,
): boolean {
  return (
    a.length === b.length &&
    a.mass === b.mass &&
    a.time === b.time &&
    a.temperature === b.temperature &&
    a.current === b.current &&
    a.amount === b.amount &&
    a.luminousIntensity === b.luminousIntensity
  );
}

/**
 * Multiply two dimensions.
 *
 * Exponents are added.
 *
 * Example:
 *   Power = Energy / Time
 */
export function multiplyDimensions(
  a: DimensionVector,
  b: DimensionVector,
): DimensionVector {
  return {
    length: a.length + b.length,
    mass: a.mass + b.mass,
    time: a.time + b.time,
    temperature: a.temperature + b.temperature,
    current: a.current + b.current,
    amount: a.amount + b.amount,
    luminousIntensity:
      a.luminousIntensity + b.luminousIntensity,
  };
}

/**
 * Divide one dimension by another.
 *
 * Exponents are subtracted.
 */
export function divideDimensions(
  a: DimensionVector,
  b: DimensionVector,
): DimensionVector {
  return {
    length: a.length - b.length,
    mass: a.mass - b.mass,
    time: a.time - b.time,
    temperature: a.temperature - b.temperature,
    current: a.current - b.current,
    amount: a.amount - b.amount,
    luminousIntensity:
      a.luminousIntensity - b.luminousIntensity,
  };
}

/**
 * Raise a dimension to a power.
 */
export function powerDimension(
  dimension: DimensionVector,
  exponent: number,
): DimensionVector {
  if (!Number.isFinite(exponent)) {
    throw new Error(
      "Dimension exponent must be a finite number.",
    );
  }

  return {
    length: dimension.length * exponent,
    mass: dimension.mass * exponent,
    time: dimension.time * exponent,
    temperature: dimension.temperature * exponent,
    current: dimension.current * exponent,
    amount: dimension.amount * exponent,
    luminousIntensity:
      dimension.luminousIntensity * exponent,
  };
}