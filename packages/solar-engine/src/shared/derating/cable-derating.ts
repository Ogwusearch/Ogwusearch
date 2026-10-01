/**
 * Cable ampacity derating utilities.
 *
 * These functions apply explicitly supplied derating factors to a
 * reference cable ampacity.
 *
 * Factors are represented as decimal multipliers:
 *
 *   1.00 = 100%
 *   0.90 = 90%
 *   0.80 = 80%
 *
 * This module does not determine which derating factors apply to
 * an installation. That decision belongs to the cable/design
 * validation layer using the applicable engineering requirements.
 */

/**
 * Applies a temperature derating factor to cable ampacity.
 *
 * Formula:
 *   Iadjusted = Irated × Ftemperature
 */
export function applyCableTemperatureDerating(
  ampacityA: number,
  temperatureFactor: number,
): number {
  return ampacityA * temperatureFactor;
}

/**
 * Applies a conductor-grouping derating factor.
 *
 * Formula:
 *   Iadjusted = Irated × Fgrouping
 */
export function applyCableGroupingDerating(
  ampacityA: number,
  groupingFactor: number,
): number {
  return ampacityA * groupingFactor;
}

/**
 * Applies an installation-method derating factor.
 *
 * Formula:
 *   Iadjusted = Irated × Finstallation
 */
export function applyCableInstallationDerating(
  ampacityA: number,
  installationFactor: number,
): number {
  return ampacityA * installationFactor;
}

/**
 * Applies an altitude derating factor.
 *
 * Formula:
 *   Iadjusted = Irated × Faltitude
 */
export function applyCableAltitudeDerating(
  ampacityA: number,
  altitudeFactor: number,
): number {
  return ampacityA * altitudeFactor;
}

/**
 * Applies multiple independent cable derating factors.
 *
 * Formula:
 *
 *   Iadjusted =
 *     Irated
 *     × Ftemperature
 *     × Fgrouping
 *     × Finstallation
 *     × Faltitude
 *
 * Omitted factors default to 1.0, meaning no adjustment.
 */
export function applyCableDerating(
  ampacityA: number,
  factors: {
    readonly temperature?: number;
    readonly grouping?: number;
    readonly installation?: number;
    readonly altitude?: number;
  },
): number {
  return (
    ampacityA *
    (factors.temperature ?? 1) *
    (factors.grouping ?? 1) *
    (factors.installation ?? 1) *
    (factors.altitude ?? 1)
  );
}

/**
 * Applies a sequence of cable derating factors.
 *
 * This helper is useful when derating factors are calculated
 * dynamically as an ordered collection.
 */
export function applyCableDeratingFactors(
  ampacityA: number,
  factors: readonly number[],
): number {
  return factors.reduce(
    (adjustedAmpacity, factor) =>
      adjustedAmpacity * factor,
    ampacityA,
  );
}

/**
 * Calculates the combined cable derating factor.
 *
 * Formula:
 *   Fcombined = F1 × F2 × ... × Fn
 */
export function calculateCombinedCableDeratingFactor(
  factors: readonly number[],
): number {
  return factors.reduce(
    (combinedFactor, factor) =>
      combinedFactor * factor,
    1,
  );
}

/**
 * Calculates the usable ampacity margin remaining after derating.
 *
 * Formula:
 *   Margin = Iadjusted - Iload
 */
export function calculateCableAmpacityMarginA(
  adjustedAmpacityA: number,
  designCurrentA: number,
): number {
  return adjustedAmpacityA - designCurrentA;
}

/**
 * Calculates cable ampacity utilization.
 *
 * Formula:
 *   Utilization = Iload / Iadjusted
 *
 * The result is a decimal ratio:
 *
 *   0.80 = 80%
 */
export function calculateCableAmpacityUtilization(
  designCurrentA: number,
  adjustedAmpacityA: number,
): number {
  return designCurrentA / adjustedAmpacityA;
}