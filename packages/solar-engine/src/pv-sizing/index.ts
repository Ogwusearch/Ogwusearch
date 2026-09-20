import type {
  PVSizingInput,
  PVSizingResult,
  PVSizingTrace,
  PVSizingValue,
} from "./types";

import { validatePVSizingInput } from "./validation";
import { calculatePVSizing } from "./calculations";
import { generatePVSizingWarnings } from "./warnings";

const ENGINE_VERSION = "1.0.0";

export function calculatePVSizingResult(
  input: PVSizingInput
): PVSizingResult {
  const metadata = {
    engine: "pv-sizing" as const,
    version: ENGINE_VERSION,
    unitSystem: "SI" as const,
  };

  // ------------------------------------------------------------
  // 1. Validation
  // ------------------------------------------------------------

  const errors = validatePVSizingInput(input);

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

  const value: PVSizingValue = calculatePVSizing(input);

  // ------------------------------------------------------------
  // 3. Warnings
  // ------------------------------------------------------------

  const warnings = generatePVSizingWarnings(input, value);

  // ------------------------------------------------------------
  // 4. Calculation trace
  // ------------------------------------------------------------

  const calculations: PVSizingTrace["calculations"] = {
    dailyEnergyKWh: input.dailyEnergyKWh,
    peakSunHours: input.peakSunHours,
    systemEfficiency: input.systemEfficiency,
    requiredPVEnergyKWh: value.requiredPVEnergyKWh,
    requiredPVPowerW: value.requiredPVPowerW,
    requiredPVPowerKW: value.requiredPVPowerKW,
  };

  if (input.panelPowerW !== undefined) {
    calculations.panelPowerW = input.panelPowerW;
  }

  if (value.requiredPanelCount !== undefined) {
    calculations.requiredPanelCount = value.requiredPanelCount;
  }

  if (value.installedPVCapacityW !== undefined) {
    calculations.installedPVCapacityW =
      value.installedPVCapacityW;
  }

  if (value.installedPVCapacityKW !== undefined) {
    calculations.installedPVCapacityKW =
      value.installedPVCapacityKW;
  }

  if (value.oversizingW !== undefined) {
    calculations.oversizingW = value.oversizingW;
  }

  if (value.oversizingKW !== undefined) {
    calculations.oversizingKW = value.oversizingKW;
  }

  if (value.oversizingRatio !== undefined) {
    calculations.oversizingRatio = value.oversizingRatio;
  }

  if (value.oversizingPercent !== undefined) {
    calculations.oversizingPercent =
      value.oversizingPercent;
  }

  const trace: PVSizingTrace = {
    formulas: {
      requiredPVEnergyKWh:
        "requiredPVEnergyKWh = dailyEnergyKWh / systemEfficiency",

      requiredPVPowerW:
        "requiredPVPowerW = (requiredPVEnergyKWh / peakSunHours) × 1000",

      requiredPVPowerKW:
        "requiredPVPowerKW = requiredPVPowerW / 1000",

      requiredPanelCount:
        "requiredPanelCount = ceil(requiredPVPowerW / panelPowerW)",

      installedPVCapacityW:
        "installedPVCapacityW = requiredPanelCount × panelPowerW",

      oversizingW:
        "oversizingW = installedPVCapacityW - requiredPVPowerW",

      oversizingRatio:
        "oversizingRatio = oversizingW / requiredPVPowerW",

      oversizingPercent:
        "oversizingPercent = oversizingRatio × 100",
    },

    assumptions: [
      "Daily energy demand is represented in kWh/day.",
      "Peak sun hours represent equivalent full-sun production hours per day.",
      "System efficiency is represented as a decimal between 0 and 1.",
      "PV power is calculated using the supplied peak-sun-hour and efficiency assumptions.",
      "Panel count is rounded up to the next whole panel when panelPowerW is supplied.",
    ],

    calculations,
  };

  // ------------------------------------------------------------
  // 5. Final result
  // ------------------------------------------------------------

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
  calculatePVSizing,
};

export type {
  PVSizingInput,
  PVSizingResult,
  PVSizingValue,
};