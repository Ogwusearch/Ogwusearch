// ============================================================
// @ogwusearch/engineering-units
// Unit Registry
// ============================================================

import type { ChargeUnit } from "./charge.js";
import { CHARGE_UNITS } from "./charge.js";

import type { CurrentUnit } from "./current.js";
import { CURRENT_UNITS } from "./current.js";

import type { EnergyUnit } from "./energy.js";
import { ENERGY_UNITS } from "./energy.js";

import type { LengthUnit } from "./length.js";
import { LENGTH_UNITS } from "./length.js";

import type { PercentageUnit } from "./percentage.js";
import { PERCENTAGE_UNITS } from "./percentage.js";

import type { PowerUnit } from "./power.js";
import { POWER_UNITS } from "./power.js";

import type { ResistanceUnit } from "./resistance.js";
import { RESISTANCE_UNITS } from "./resistance.js";

import type { TemperatureUnit } from "./temperature.js";
import { TEMPERATURE_UNITS } from "./temperature.js";

import type { TimeUnit } from "./time.js";
import { TIME_UNITS } from "./time.js";

import type { VoltageUnit } from "./voltage.js";
import { VOLTAGE_UNITS } from "./voltage.js";

/**
 * Registry containing all supported engineering units.
 */
export const UNIT_REGISTRY = {
  charge: CHARGE_UNITS,
  current: CURRENT_UNITS,
  energy: ENERGY_UNITS,
  length: LENGTH_UNITS,
  percentage: PERCENTAGE_UNITS,
  power: POWER_UNITS,
  resistance: RESISTANCE_UNITS,
  temperature: TEMPERATURE_UNITS,
  time: TIME_UNITS,
  voltage: VOLTAGE_UNITS,
} as const;

/**
 * Unit categories available in the registry.
 */
export type UnitCategory = keyof typeof UNIT_REGISTRY;

/**
 * All registered unit collections.
 */
export type UnitRegistry = typeof UNIT_REGISTRY;

/**
 * Retrieve a unit collection by category.
 */
export function getUnitCategory(
  category: UnitCategory,
): UnitRegistry[UnitCategory] {
  return UNIT_REGISTRY[category];
}

/**
 * Look up a unit by its category and symbol.
 */
export function getUnit(
  category: UnitCategory,
  symbol: string,
):
  | ChargeUnit
  | CurrentUnit
  | EnergyUnit
  | LengthUnit
  | PercentageUnit
  | PowerUnit
  | ResistanceUnit
  | TemperatureUnit
  | TimeUnit
  | VoltageUnit
  | undefined {
  const units = UNIT_REGISTRY[category] as Record<
    string,
    | ChargeUnit
    | CurrentUnit
    | EnergyUnit
    | LengthUnit
    | PercentageUnit
    | PowerUnit
    | ResistanceUnit
    | TemperatureUnit
    | TimeUnit
    | VoltageUnit
  >;

  return units[symbol];
}