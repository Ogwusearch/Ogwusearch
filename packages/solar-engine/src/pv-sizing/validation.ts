import type { ValidationResult } from "@ogwusearch/engineering-validation";

import { PV_SIZING_ERROR_CODES } from "./errors";
import type { PVSizingInput } from "./types";
import { PV_SIZING_WARNING_CODES } from "./warnings";

export function validatePVSizingInput(
  input: PVSizingInput,
): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  const addError = (
    code: string,
    message: string,
    field: string,
    value: unknown,
  ): void => {
    errors.push({
      code,
      field,
      message,
      value,
      severity: "error",
    });
  };

  const addWarning = (
    code: string,
    message: string,
    field: string,
    value: unknown,
  ): void => {
    warnings.push({
      code,
      field,
      message,
      value,
      severity: "warning",
    });
  };

  if (!Number.isFinite(input.dailyEnergyKWh)) {
    addError(
      PV_SIZING_ERROR_CODES.INVALID_DAILY_ENERGY,
      "Daily energy must be a finite number.",
      "dailyEnergyKWh",
      input.dailyEnergyKWh,
    );
  } else if (input.dailyEnergyKWh <= 0) {
    addError(
      PV_SIZING_ERROR_CODES.INVALID_DAILY_ENERGY,
      "Daily energy must be greater than zero.",
      "dailyEnergyKWh",
      input.dailyEnergyKWh,
    );
  }

  if (!Number.isFinite(input.peakSunHours)) {
    addError(
      PV_SIZING_ERROR_CODES.INVALID_PEAK_SUN_HOURS,
      "Peak sun hours must be a finite number.",
      "peakSunHours",
      input.peakSunHours,
    );
  } else if (input.peakSunHours <= 0) {
    addError(
      PV_SIZING_ERROR_CODES.INVALID_PEAK_SUN_HOURS,
      "Peak sun hours must be greater than zero.",
      "peakSunHours",
      input.peakSunHours,
    );
  }

  if (!Number.isFinite(input.systemEfficiency)) {
    addError(
      PV_SIZING_ERROR_CODES.INVALID_SYSTEM_EFFICIENCY,
      "System efficiency must be a finite number.",
      "systemEfficiency",
      input.systemEfficiency,
    );
  } else if (
    input.systemEfficiency <= 0 ||
    input.systemEfficiency > 1
  ) {
    addError(
      PV_SIZING_ERROR_CODES.INVALID_SYSTEM_EFFICIENCY,
      "System efficiency must be greater than 0 and less than or equal to 1.",
      "systemEfficiency",
      input.systemEfficiency,
    );
  }

  if (input.panelPowerW !== undefined) {
    if (!Number.isFinite(input.panelPowerW)) {
      addError(
        PV_SIZING_ERROR_CODES.INVALID_PANEL_POWER,
        "Panel power must be a finite number.",
        "panelPowerW",
        input.panelPowerW,
      );
    } else if (input.panelPowerW <= 0) {
      addError(
        PV_SIZING_ERROR_CODES.INVALID_PANEL_POWER,
        "Panel power must be greater than zero.",
        "panelPowerW",
        input.panelPowerW,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}