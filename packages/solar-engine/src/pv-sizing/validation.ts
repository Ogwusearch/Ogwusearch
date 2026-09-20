import type {
  EngineeringMessage,
  PVSizingInput,
} from "./types";

export function validatePVSizingInput(
  input: PVSizingInput,
): EngineeringMessage[] {
  const errors: EngineeringMessage[] = [];

  if (!Number.isFinite(input.dailyEnergyKWh)) {
    errors.push({
      code: "INVALID_DAILY_ENERGY",
      field: "dailyEnergyKWh",
      message: "Daily energy must be a finite number.",
      value: input.dailyEnergyKWh,
    });
  } else if (input.dailyEnergyKWh <= 0) {
    errors.push({
      code: "INVALID_DAILY_ENERGY",
      field: "dailyEnergyKWh",
      message: "Daily energy must be greater than zero.",
      value: input.dailyEnergyKWh,
    });
  }

  if (!Number.isFinite(input.peakSunHours)) {
    errors.push({
      code: "INVALID_PEAK_SUN_HOURS",
      field: "peakSunHours",
      message: "Peak sun hours must be a finite number.",
      value: input.peakSunHours,
    });
  } else if (input.peakSunHours <= 0) {
    errors.push({
      code: "INVALID_PEAK_SUN_HOURS",
      field: "peakSunHours",
      message: "Peak sun hours must be greater than zero.",
      value: input.peakSunHours,
    });
  }

  if (!Number.isFinite(input.systemEfficiency)) {
    errors.push({
      code: "INVALID_SYSTEM_EFFICIENCY",
      field: "systemEfficiency",
      message: "System efficiency must be a finite number.",
      value: input.systemEfficiency,
    });
  } else if (
    input.systemEfficiency <= 0 ||
    input.systemEfficiency > 1
  ) {
    errors.push({
      code: "INVALID_SYSTEM_EFFICIENCY",
      field: "systemEfficiency",
      message:
        "System efficiency must be greater than 0 and less than or equal to 1.",
      value: input.systemEfficiency,
    });
  }

  if (input.panelPowerW !== undefined) {
    if (!Number.isFinite(input.panelPowerW)) {
      errors.push({
        code: "INVALID_PANEL_POWER",
        field: "panelPowerW",
        message: "Panel power must be a finite number.",
        value: input.panelPowerW,
      });
    } else if (input.panelPowerW <= 0) {
      errors.push({
        code: "INVALID_PANEL_POWER",
        field: "panelPowerW",
        message: "Panel power must be greater than zero.",
        value: input.panelPowerW,
      });
    }
  }

  return errors;
}