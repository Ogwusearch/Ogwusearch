/**
 * Solar production-ratio formulas.
 *
 * A production ratio is represented as a decimal fraction:
 *
 *   1.00 = 100%
 *   0.90 = 90%
 *   0.75 = 75%
 *
 * These functions are pure mathematical helpers.
 * Input validation and domain-specific constraints belong
 * to the appropriate validation/domain modules.
 */

/**
 * Calculates production ratio from actual and ideal energy.
 *
 * Formula:
 *   PR = Eactual / Eideal
 */
export function calculateProductionRatio(
  actualEnergyWh: number,
  idealEnergyWh: number,
): number {
  return actualEnergyWh / idealEnergyWh;
}

/**
 * Calculates a combined production ratio from multiple
 * retained-performance factors.
 *
 * Formula:
 *   PRtotal = f1 × f2 × ... × fn
 *
 * Example:
 *   0.95 × 0.98 × 0.97 = 0.90307
 */
export function calculateProductionRatioFromFactors(
  factors: readonly number[],
): number {
  return factors.reduce(
    (ratio, factor) => ratio * factor,
    1,
  );
}

/**
 * Converts a loss percentage into a retained-performance factor.
 *
 * Formula:
 *   factor = 1 - (loss% / 100)
 *
 * Example:
 *   5% loss → 0.95
 */
export function lossPercentageToFactor(
  lossPercentage: number,
): number {
  return 1 - lossPercentage / 100;
}

/**
 * Converts a retained-performance factor into a loss percentage.
 *
 * Formula:
 *   loss% = (1 - factor) × 100
 *
 * Example:
 *   0.95 → 5%
 */
export function factorToLossPercentage(
  factor: number,
): number {
  return (1 - factor) * 100;
}

/**
 * Calculates actual production from ideal production
 * and a production ratio.
 *
 * Formula:
 *   Eactual = Eideal × PR
 */
export function calculateActualProductionWh(
  idealEnergyWh: number,
  productionRatio: number,
): number {
  return idealEnergyWh * productionRatio;
}

/**
 * Calculates ideal production from actual production
 * and a production ratio.
 *
 * Formula:
 *   Eideal = Eactual / PR
 */
export function calculateIdealProductionWh(
  actualEnergyWh: number,
  productionRatio: number,
): number {
  return actualEnergyWh / productionRatio;
}

/**
 * Calculates production loss from ideal and actual energy.
 *
 * Formula:
 *   Eloss = Eideal - Eactual
 */
export function calculateProductionLossWh(
  idealEnergyWh: number,
  actualEnergyWh: number,
): number {
  return idealEnergyWh - actualEnergyWh;
}

/**
 * Calculates production loss percentage.
 *
 * Formula:
 *   Loss% =
 *     ((Eideal - Eactual) / Eideal) × 100
 */
export function calculateProductionLossPercentage(
  idealEnergyWh: number,
  actualEnergyWh: number,
): number {
  return (
    (idealEnergyWh - actualEnergyWh) /
    idealEnergyWh
  ) * 100;
}