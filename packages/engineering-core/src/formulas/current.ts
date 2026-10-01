/**
 * Generic electrical current relationships.
 *
 * These functions operate on normalized numeric values.
 * Unit representation and conversion belong to
 * @ogwusearch/engineering-units.
 */

/**
 * Calculates DC current from power and voltage.
 *
 * I = P / V
 */
export function calculateCurrentFromPower(
  powerW: number,
  voltageV: number,
): number {
  return powerW / voltageV;
}

/**
 * Calculates single-phase AC current from real power.
 *
 * I = P / (V × PF)
 */
export function calculateSinglePhaseCurrent(
  powerW: number,
  voltageV: number,
  powerFactor = 1,
): number {
  return powerW / (voltageV * powerFactor);
}

/**
 * Calculates three-phase AC current from real power.
 *
 * I = P / (√3 × V × PF)
 */
export function calculateThreePhaseCurrent(
  powerW: number,
  voltageV: number,
  powerFactor = 1,
): number {
  return powerW / (
    Math.sqrt(3) *
    voltageV *
    powerFactor
  );
}

/**
 * Applies a design margin to an operating current.
 *
 * Idesign = I × (1 + margin)
 */
export function calculateDesignCurrent(
  currentA: number,
  margin = 0.25,
): number {
  return currentA * (1 + margin);
}

/**
 * Calculates single-phase current from apparent power.
 *
 * I = S / V
 */
export function calculateSinglePhaseCurrentFromApparentPower(
  apparentPowerVA: number,
  voltageV: number,
): number {
  return apparentPowerVA / voltageV;
}

/**
 * Calculates three-phase current from apparent power.
 *
 * I = S / (√3 × V)
 */
export function calculateThreePhaseCurrentFromApparentPower(
  apparentPowerVA: number,
  voltageV: number,
): number {
  return apparentPowerVA / (
    Math.sqrt(3) *
    voltageV
  );
}

/**
 * Applies a multiplicative factor to current.
 *
 * A factor below 1 reduces the resulting current.
 */
export function applyCurrentFactor(
  currentA: number,
  factor: number,
): number {
  return currentA * factor;
}
