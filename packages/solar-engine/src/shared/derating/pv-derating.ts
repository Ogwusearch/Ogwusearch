/**
 * PV system derating calculations.
 *
 * These functions are pure mathematical helpers.
 * Validation and decisions about which derating factors apply
 * belong to the appropriate PV domain modules.
 *
 * Factors:
 *   1.00 = 100% retained
 *   0.95 = 95% retained
 *   0.80 = 80% retained
 *
 * Loss fractions:
 *   0.03 = 3% loss
 *   0.08 = 8% loss
 */

/**
 * Applies a PV temperature-performance factor.
 *
 * Formula:
 *   Padjusted = Prated × temperatureFactor
 */
export function applyPvTemperatureDerating(
  ratedPowerW: number,
  temperatureFactor: number,
): number {
  return ratedPowerW * temperatureFactor;
}

/**
 * Applies PV soiling loss.
 *
 * Formula:
 *   Padjusted = P × (1 - loss)
 *
 * Example:
 *   1000 W with 3% soiling loss = 970 W
 */
export function applyPvSoilingLoss(
  powerW: number,
  lossFraction = 0.03,
): number {
  return powerW * (1 - lossFraction);
}

/**
 * Applies PV wiring loss.
 *
 * Formula:
 *   Padjusted = P × (1 - loss)
 */
export function applyPvWiringLoss(
  powerW: number,
  lossFraction = 0.02,
): number {
  return powerW * (1 - lossFraction);
}

/**
 * Applies PV mismatch loss.
 *
 * Formula:
 *   Padjusted = P × (1 - loss)
 */
export function applyPvMismatchLoss(
  powerW: number,
  lossFraction = 0.02,
): number {
  return powerW * (1 - lossFraction);
}

/**
 * Applies PV shading loss.
 *
 * Formula:
 *   Padjusted = P × (1 - loss)
 */
export function applyPvShadingLoss(
  powerW: number,
  lossFraction: number,
): number {
  return powerW * (1 - lossFraction);
}

/**
 * Applies inverter efficiency to DC PV power.
 *
 * Formula:
 *   Pac = Pdc × ηinverter
 */
export function applyPvInverterEfficiency(
  dcPowerW: number,
  inverterEfficiency: number,
): number {
  return dcPowerW * inverterEfficiency;
}

/**
 * Applies a retained-performance factor to PV power.
 */
export function applyPvPerformanceFactor(
  powerW: number,
  performanceFactor: number,
): number {
  return powerW * performanceFactor;
}

/**
 * Combines multiple retained-performance factors.
 *
 * Each factor represents the fraction of power retained after
 * a particular loss or derating condition.
 */
export function calculateCombinedPvDeratingFactor(
  factors: readonly number[],
): number {
  return factors.reduce(
    (factor, current) => factor * current,
    1,
  );
}

/**
 * Applies multiple retained-performance factors to rated PV power.
 *
 * Example:
 *
 *   temperature = 0.92
 *   wiring      = 0.98
 *   mismatch    = 0.98
 *
 *   Pactual = Prated × 0.92 × 0.98 × 0.98
 */
export function applyPvDerating(
  ratedPowerW: number,
  factors: {
    readonly temperature?: number;
    readonly soiling?: number;
    readonly wiring?: number;
    readonly mismatch?: number;
    readonly shading?: number;
    readonly inverter?: number;
  },
): number {
  return (
    ratedPowerW *
    (factors.temperature ?? 1) *
    (factors.soiling ?? 1) *
    (factors.wiring ?? 1) *
    (factors.mismatch ?? 1) *
    (factors.shading ?? 1) *
    (factors.inverter ?? 1)
  );
}

/**
 * Applies multiple explicit loss fractions directly.
 *
 * Example:
 *
 *   losses = {
 *     soiling: 0.03,
 *     wiring: 0.02,
 *     mismatch: 0.02,
 *   }
 */
export function applyPvLosses(
  powerW: number,
  losses: {
    readonly soiling?: number;
    readonly wiring?: number;
    readonly mismatch?: number;
    readonly shading?: number;
  },
): number {
  return (
    powerW *
    (1 - (losses.soiling ?? 0)) *
    (1 - (losses.wiring ?? 0)) *
    (1 - (losses.mismatch ?? 0)) *
    (1 - (losses.shading ?? 0))
  );
}