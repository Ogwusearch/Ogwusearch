/**
 * SolarAudit — Energy Engine
 *
 * Performs deterministic electrical energy calculations.
 *
 * Formulas:
 *
 * Connected Power (W)
 *   = quantity × powerW
 *
 * Daily Energy (Wh)
 *   = connected power × hoursPerDay
 *
 * Daily Energy (kWh)
 *   = daily energy Wh ÷ 1000
 */

import type {
  EnergyInput,
  EnergyLoad,
  EnergyResult,
  LoadEnergyResult,
} from "./types";

import { validateEnergyInput } from "./validation";

/* ============================================================
 * LOAD CALCULATION
 * ============================================================ */

/**
 * Calculate energy consumption for one electrical load.
 */
export function calculateLoadEnergy(
  load: EnergyLoad,
): LoadEnergyResult {
  const connectedPowerW =
    load.quantity * load.powerW;

  const dailyEnergyWh =
    connectedPowerW * load.hoursPerDay;

  const dailyEnergyKWh =
    dailyEnergyWh / 1000;

  return {
    loadId: load.id,
    name: load.name,
    quantity: load.quantity,
    powerW: load.powerW,
    hoursPerDay: load.hoursPerDay,
    connectedPowerW,
    dailyEnergyWh,
    dailyEnergyKWh,
  };
}

/* ============================================================
 * TOTAL CONNECTED POWER
 * ============================================================ */

/**
 * Calculate total connected load.
 */
export function calculateTotalConnectedPower(
  loads: LoadEnergyResult[],
): number {
  return loads.reduce(
    (total, load) =>
      total + load.connectedPowerW,
    0,
  );
}

/* ============================================================
 * TOTAL DAILY ENERGY
 * ============================================================ */

/**
 * Calculate total daily energy in watt-hours.
 */
export function calculateTotalDailyEnergyWh(
  loads: LoadEnergyResult[],
): number {
  return loads.reduce(
    (total, load) =>
      total + load.dailyEnergyWh,
    0,
  );
}

/* ============================================================
 * COMPLETE ENERGY CALCULATION
 * ============================================================ */

/**
 * Calculate complete daily energy consumption.
 *
 * Validation is performed before calculations.
 */
export function calculateEnergy(
  input: EnergyInput,
): EnergyResult {
  const validation =
    validateEnergyInput(input);

  if (!validation.valid) {
    return {
      valid: false,

      totalConnectedPowerW: 0,

      totalDailyEnergyWh: 0,

      totalDailyEnergyKWh: 0,

      loads: [],

      warnings: validation.warnings,

      errors: validation.errors,
    };
  }

  const loads =
    input.loads.map(calculateLoadEnergy);

  const totalConnectedPowerW =
    calculateTotalConnectedPower(loads);

  const totalDailyEnergyWh =
    calculateTotalDailyEnergyWh(loads);

  const totalDailyEnergyKWh =
    totalDailyEnergyWh / 1000;

  return {
    valid: true,

    totalConnectedPowerW,

    totalDailyEnergyWh,

    totalDailyEnergyKWh,

    loads,

    warnings: validation.warnings,

    errors: validation.errors,
  };
}