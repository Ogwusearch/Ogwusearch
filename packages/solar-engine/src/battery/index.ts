import type {
  BatterySizingInput,
  BatterySizingResult,
  BatterySizingTrace,
  BatterySizingValue,
} from "./types";

import { validateBatterySizingInput } from "./validation";
import { calculateBatterySizing } from "./calculations";
import { generateBatterySizingWarnings } from "./warnings";

const ENGINE_VERSION = "1.0.0";

export function calculateBatterySizingResult(
  input: BatterySizingInput
): BatterySizingResult {
  const metadata = {
    engine: "battery-sizing" as const,
    version: ENGINE_VERSION,
    unitSystem: "SI" as const,
  };

  // ------------------------------------------------------------
  // 1. Validation
  // ------------------------------------------------------------

  const errors = validateBatterySizingInput(input);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      warnings: [],
      metadata,
    };
  }

  // ------------------------------------------------------------
  // 2. Calculation
  // ------------------------------------------------------------

  const value: BatterySizingValue =
    calculateBatterySizing(input);

  // ------------------------------------------------------------
  // 3. Warnings
  // ------------------------------------------------------------

  const warnings =
    generateBatterySizingWarnings(input, value);

  // ------------------------------------------------------------
  // 4. Calculation trace
  // ------------------------------------------------------------

  const calculations: BatterySizingTrace["calculations"] = {
    dailyEnergyKWh: input.dailyEnergyKWh,
    autonomyDays: input.autonomyDays,
    systemVoltageV: input.systemVoltageV,
    depthOfDischarge: input.depthOfDischarge,
    batteryEfficiency: input.batteryEfficiency,
    designMargin: input.designMargin,

    requiredBatteryEnergyKWh:
      value.requiredBatteryEnergyKWh,

    adjustedBatteryEnergyKWh:
      value.adjustedBatteryEnergyKWh,

    requiredBatteryCapacityAh:
      value.requiredBatteryCapacityAh,
  };

  if (input.batteryUnitVoltageV !== undefined) {
    calculations.batteryUnitVoltageV =
      input.batteryUnitVoltageV;
  }

  if (input.batteryUnitCapacityAh !== undefined) {
    calculations.batteryUnitCapacityAh =
      input.batteryUnitCapacityAh;
  }

  if (value.seriesBatteries !== undefined) {
    calculations.seriesBatteries =
      value.seriesBatteries;
  }

  if (value.parallelStrings !== undefined) {
    calculations.parallelStrings =
      value.parallelStrings;
  }

  if (value.totalBatteryUnits !== undefined) {
    calculations.totalBatteryUnits =
      value.totalBatteryUnits;
  }

  if (value.installedBatteryCapacityAh !== undefined) {
    calculations.installedBatteryCapacityAh =
      value.installedBatteryCapacityAh;
  }

  if (value.installedBatteryEnergyKWh !== undefined) {
    calculations.installedBatteryEnergyKWh =
      value.installedBatteryEnergyKWh;
  }

  const trace: BatterySizingTrace = {
    formulas: {
      requiredBatteryEnergyKWh:
        "requiredBatteryEnergyKWh = dailyEnergyKWh × autonomyDays",

      adjustedBatteryEnergyKWh:
        "adjustedBatteryEnergyKWh = (requiredBatteryEnergyKWh / batteryEfficiency / depthOfDischarge) × (1 + designMargin)",

      requiredBatteryCapacityAh:
        "requiredBatteryCapacityAh = (adjustedBatteryEnergyKWh × 1000) / systemVoltageV",

      seriesBatteries:
        "seriesBatteries = ceil(systemVoltageV / batteryUnitVoltageV)",

      parallelStrings:
        "parallelStrings = ceil(requiredBatteryCapacityAh / batteryUnitCapacityAh)",

      totalBatteryUnits:
        "totalBatteryUnits = seriesBatteries × parallelStrings",

      installedBatteryCapacityAh:
        "installedBatteryCapacityAh = parallelStrings × batteryUnitCapacityAh",

      installedBatteryEnergyKWh:
        "installedBatteryEnergyKWh = (totalBatteryUnits × batteryUnitVoltageV × batteryUnitCapacityAh) / 1000",
    },

    assumptions: [
      "Daily energy is represented in kWh/day.",
      "Autonomy is represented in days.",
      "Depth of discharge and battery efficiency are represented as decimals between 0 and 1.",
      "Design margin is represented as a decimal.",
      "Battery capacity is calculated from nominal system voltage.",
      "Physical battery configuration is calculated only when battery unit voltage and capacity are supplied.",
      "Series and parallel quantities are rounded up to whole units.",
    ],

    calculations,
  };

  return {
    success: true,
    value,
    errors: [],
    warnings,
    trace,
    metadata,
  };
}

export {
  calculateBatterySizing,
};

export type {
  BatterySizingInput,
  BatterySizingResult,
  BatterySizingValue,
};