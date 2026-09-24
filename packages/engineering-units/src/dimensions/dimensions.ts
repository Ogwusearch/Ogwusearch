// ============================================================
// @ogwusearch/engineering-units
// Standard Dimensions
// ============================================================

import {
  createDimension,
  type DimensionVector,
} from "./dimension.js";

/**
 * Dimensionless quantity.
 *
 * Examples:
 *   ratio
 *   percentage
 *   efficiency
 */
export const DIMENSIONLESS: DimensionVector =
  createDimension();

/**
 * Length.
 *
 * SI base dimension: L
 */
export const LENGTH: DimensionVector = createDimension({
  length: 1,
});

/**
 * Mass.
 *
 * SI base dimension: M
 */
export const MASS: DimensionVector = createDimension({
  mass: 1,
});

/**
 * Time.
 *
 * SI base dimension: T
 */
export const TIME: DimensionVector = createDimension({
  time: 1,
});

/**
 * Thermodynamic temperature.
 *
 * SI base dimension: Θ
 */
export const TEMPERATURE: DimensionVector =
  createDimension({
    temperature: 1,
  });

/**
 * Electric current.
 *
 * SI base dimension: I
 */
export const CURRENT: DimensionVector =
  createDimension({
    current: 1,
  });

/**
 * Amount of substance.
 *
 * SI base dimension: N
 */
export const AMOUNT: DimensionVector =
  createDimension({
    amount: 1,
  });

/**
 * Luminous intensity.
 *
 * SI base dimension: J
 */
export const LUMINOUS_INTENSITY: DimensionVector =
  createDimension({
    luminousIntensity: 1,
  });

/**
 * Area.
 *
 * L²
 */
export const AREA: DimensionVector =
  createDimension({
    length: 2,
  });

/**
 * Volume.
 *
 * L³
 */
export const VOLUME: DimensionVector =
  createDimension({
    length: 3,
  });

/**
 * Velocity.
 *
 * L T⁻¹
 */
export const VELOCITY: DimensionVector =
  createDimension({
    length: 1,
    time: -1,
  });

/**
 * Acceleration.
 *
 * L T⁻²
 */
export const ACCELERATION: DimensionVector =
  createDimension({
    length: 1,
    time: -2,
  });

/**
 * Force.
 *
 * M L T⁻²
 */
export const FORCE: DimensionVector =
  createDimension({
    length: 1,
    mass: 1,
    time: -2,
  });

/**
 * Energy.
 *
 * M L² T⁻²
 */
export const ENERGY: DimensionVector =
  createDimension({
    length: 2,
    mass: 1,
    time: -2,
  });

/**
 * Power.
 *
 * M L² T⁻³
 */
export const POWER: DimensionVector =
  createDimension({
    length: 2,
    mass: 1,
    time: -3,
  });

/**
 * Electric charge.
 *
 * I T
 */
export const CHARGE: DimensionVector =
  createDimension({
    current: 1,
    time: 1,
  });

/**
 * Voltage / electrical potential difference.
 *
 * M L² T⁻³ I⁻¹
 */
export const VOLTAGE: DimensionVector =
  createDimension({
    length: 2,
    mass: 1,
    time: -3,
    current: -1,
  });

/**
 * Electrical resistance.
 *
 * M L² T⁻³ I⁻²
 */
export const RESISTANCE: DimensionVector =
  createDimension({
    length: 2,
    mass: 1,
    time: -3,
    current: -2,
  });

/**
 * Frequency.
 *
 * T⁻¹
 */
export const FREQUENCY: DimensionVector =
  createDimension({
    time: -1,
  });

/**
 * Pressure.
 *
 * M L⁻¹ T⁻²
 */
export const PRESSURE: DimensionVector =
  createDimension({
    length: -1,
    mass: 1,
    time: -2,
  });