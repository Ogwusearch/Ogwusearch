/**
 * Generic Ohm's-law electrical relationships.
 *
 * These functions operate on normalized numeric values.
 * Unit representation and conversion belong to
 * @ogwusearch/engineering-units.
 */

/**
 * V = I × R
 */
export function calculateVoltage(
  currentA: number,
  resistanceOhms: number,
): number {
  return currentA * resistanceOhms;
}

/**
 * I = V / R
 */
export function calculateCurrent(
  voltageV: number,
  resistanceOhms: number,
): number {
  return voltageV / resistanceOhms;
}

/**
 * R = V / I
 */
export function calculateResistance(
  voltageV: number,
  currentA: number,
): number {
  return voltageV / currentA;
}

/**
 * P_loss = I² × R
 */
export function calculatePowerLoss(
  currentA: number,
  resistanceOhms: number,
): number {
  return currentA ** 2 * resistanceOhms;
}

/**
 * P = V × I
 */
export function calculatePower(
  voltageV: number,
  currentA: number,
): number {
  return voltageV * currentA;
}

/**
 * R = P / I²
 */
export function calculateResistanceFromPower(
  powerW: number,
  currentA: number,
): number {
  return powerW / currentA ** 2;
}

/**
 * R = V² / P
 */
export function calculateResistanceFromVoltagePower(
  voltageV: number,
  powerW: number,
): number {
  return voltageV ** 2 / powerW;
}

/**
 * P = I² × R
 */
export function calculatePowerFromCurrentResistance(
  currentA: number,
  resistanceOhms: number,
): number {
  return currentA ** 2 * resistanceOhms;
}

/**
 * P = V² / R
 */
export function calculatePowerFromVoltageResistance(
  voltageV: number,
  resistanceOhms: number,
): number {
  return voltageV ** 2 / resistanceOhms;
}
