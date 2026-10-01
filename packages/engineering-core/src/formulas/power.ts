/**
 * Generic electrical power relationships.
 *
 * These functions operate on normalized numeric values.
 * Unit representation and conversion belong to
 * @ogwusearch/engineering-units.
 */

/**
 * Calculate DC power.
 *
 * P = V × I
 */
export function calculateDcPowerW(
  voltageV: number,
  currentA: number,
): number {
  return voltageV * currentA;
}

/**
 * Calculate DC current.
 *
 * I = P / V
 */
export function calculateDcCurrentA(
  powerW: number,
  voltageV: number,
): number {
  return powerW / voltageV;
}

/**
 * Calculate DC voltage.
 *
 * V = P / I
 */
export function calculateDcVoltageV(
  powerW: number,
  currentA: number,
): number {
  return powerW / currentA;
}

/**
 * Calculate single-phase real power.
 *
 * P = V × I × PF
 */
export function calculateSinglePhasePowerW(
  voltageV: number,
  currentA: number,
  powerFactor = 1,
): number {
  return voltageV * currentA * powerFactor;
}

/**
 * Calculate three-phase real power.
 *
 * P = √3 × V × I × PF
 */
export function calculateThreePhasePowerW(
  voltageV: number,
  currentA: number,
  powerFactor = 1,
): number {
  return Math.sqrt(3) *
    voltageV *
    currentA *
    powerFactor;
}

/**
 * Calculate single-phase apparent power.
 *
 * S = V × I
 */
export function calculateSinglePhaseApparentPowerVA(
  voltageV: number,
  currentA: number,
): number {
  return voltageV * currentA;
}

/**
 * Calculate three-phase apparent power.
 *
 * S = √3 × V × I
 */
export function calculateThreePhaseApparentPowerVA(
  voltageV: number,
  currentA: number,
): number {
  return Math.sqrt(3) *
    voltageV *
    currentA;
}

/**
 * Calculate real power from apparent power.
 *
 * P = S × PF
 */
export function calculateRealPowerFromApparentPowerW(
  apparentPowerVA: number,
  powerFactor: number,
): number {
  return apparentPowerVA * powerFactor;
}

/**
 * Calculate apparent power from real power.
 *
 * S = P / PF
 */
export function calculateApparentPowerVA(
  realPowerW: number,
  powerFactor: number,
): number {
  return realPowerW / powerFactor;
}

/**
 * Calculate reactive power.
 *
 * Q = √(S² - P²)
 */
export function calculateReactivePowerVAR(
  realPowerW: number,
  apparentPowerVA: number,
): number {
  return Math.sqrt(
    apparentPowerVA ** 2 -
    realPowerW ** 2,
  );
}

/**
 * Calculate power factor.
 *
 * PF = P / S
 */
export function calculatePowerFactor(
  realPowerW: number,
  apparentPowerVA: number,
): number {
  return realPowerW / apparentPowerVA;
}

/**
 * Calculate resistive power loss.
 *
 * P_loss = I² × R
 */
export function calculateResistivePowerLossW(
  currentA: number,
  resistanceOhms: number,
): number {
  return currentA ** 2 * resistanceOhms;
}

/**
 * Calculate output power from input power and efficiency.
 *
 * P_out = P_in × η
 */
export function calculateOutputPowerW(
  inputPowerW: number,
  efficiency: number,
): number {
  return inputPowerW * efficiency;
}

/**
 * Calculate required input power for a desired output.
 *
 * P_in = P_out / η
 */
export function calculateRequiredInputPowerW(
  outputPowerW: number,
  efficiency: number,
): number {
  return outputPowerW / efficiency;
}
