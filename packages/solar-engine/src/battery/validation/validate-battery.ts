
import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  BatterySizingInput,
} from "../types/index.js";

import type {
  BatterySizingOutput,
} from "../types/battery-output.js";

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function validateBatterySizing(
  input: BatterySizingInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  // ------------------------------------------------------------
  // Errors
  // ------------------------------------------------------------

  if (
    !isFiniteNumber(input.dailyEnergyKWh) ||
    input.dailyEnergyKWh <= 0
  ) {
    issues.push({
      code: "INVALID_DAILY_ENERGY",
      severity: "ERROR",
      message:
        "Daily energy must be greater than zero.",
      path: "dailyEnergyKWh",
      actual: input.dailyEnergyKWh,
    });
  }

  if (
    !isFiniteNumber(input.autonomyDays) ||
    input.autonomyDays <= 0
  ) {
    issues.push({
      code: "INVALID_AUTONOMY",
      severity: "ERROR",
      message:
        "Autonomy days must be greater than zero.",
      path: "autonomyDays",
      actual: input.autonomyDays,
    });
  }

  if (
    !isFiniteNumber(input.systemVoltageV) ||
    input.systemVoltageV <= 0
  ) {
    issues.push({
      code: "INVALID_SYSTEM_VOLTAGE",
      severity: "ERROR",
      message:
        "System voltage must be greater than zero.",
      path: "systemVoltageV",
      actual: input.systemVoltageV,
    });
  }

  if (
    !isFiniteNumber(input.depthOfDischarge) ||
    input.depthOfDischarge <= 0 ||
    input.depthOfDischarge > 1
  ) {
    issues.push({
      code: "INVALID_DEPTH_OF_DISCHARGE",
      severity: "ERROR",
      message:
        "Depth of discharge must be greater than 0 and no greater than 1.",
      path: "depthOfDischarge",
      actual: input.depthOfDischarge,
    });
  }

  if (
    !isFiniteNumber(input.batteryEfficiency) ||
    input.batteryEfficiency <= 0 ||
    input.batteryEfficiency > 1
  ) {
    issues.push({
      code: "INVALID_BATTERY_EFFICIENCY",
      severity: "ERROR",
      message:
        "Battery efficiency must be greater than 0 and no greater than 1.",
      path: "batteryEfficiency",
      actual: input.batteryEfficiency,
    });
  }

  if (
    !isFiniteNumber(input.designMargin) ||
    input.designMargin < 0
  ) {
    issues.push({
      code: "INVALID_DESIGN_MARGIN",
      severity: "ERROR",
      message:
        "Design margin cannot be negative.",
      path: "designMargin",
      actual: input.designMargin,
    });
  }

  if (
    input.batteryUnitVoltageV !== undefined &&
    (
      !isFiniteNumber(input.batteryUnitVoltageV) ||
      input.batteryUnitVoltageV <= 0
    )
  ) {
    issues.push({
      code: "INVALID_BATTERY_UNIT_VOLTAGE",
      severity: "ERROR",
      message:
        "Battery unit voltage must be greater than zero.",
      path: "batteryUnitVoltageV",
      actual: input.batteryUnitVoltageV,
    });
  }

  if (
    input.batteryUnitCapacityAh !== undefined &&
    (
      !isFiniteNumber(input.batteryUnitCapacityAh) ||
      input.batteryUnitCapacityAh <= 0
    )
  ) {
    issues.push({
      code: "INVALID_BATTERY_UNIT_CAPACITY",
      severity: "ERROR",
      message:
        "Battery unit capacity must be greater than zero.",
      path: "batteryUnitCapacityAh",
      actual: input.batteryUnitCapacityAh,
    });
  }

  // ------------------------------------------------------------
  // Warnings
  // ------------------------------------------------------------

  if (
    isFiniteNumber(input.depthOfDischarge) &&
    input.depthOfDischarge > 0.8
  ) {
    issues.push({
      code: "HIGH_DEPTH_OF_DISCHARGE",
      severity: "WARNING",
      message:
        "Depth of discharge is above 80%; verify the battery manufacturer's recommended operating limit.",
      path: "depthOfDischarge",
      actual: input.depthOfDischarge,
    });
  }

  if (
    isFiniteNumber(input.designMargin) &&
    input.designMargin === 0
  ) {
    issues.push({
      code: "NO_DESIGN_MARGIN",
      severity: "WARNING",
      message:
        "No additional battery design margin has been applied.",
      path: "designMargin",
      actual: input.designMargin,
    });
  }

  if (
    input.batteryUnitVoltageV !== undefined &&
    isFiniteNumber(input.batteryUnitVoltageV) &&
    isFiniteNumber(input.systemVoltageV) &&
    input.systemVoltageV %
      input.batteryUnitVoltageV !==
      0
  ) {
    issues.push({
      code: "NON_INTEGER_SERIES_CONFIGURATION",
      severity: "WARNING",
      message:
        "Battery unit voltage does not divide evenly into the system voltage; series count has been rounded up.",
      path: "batteryUnitVoltageV",
      actual: input.batteryUnitVoltageV,
    });
  }

  /*
   * This warning previously depended on the calculated value.
   * It therefore belongs after calculation, not input validation.
   *
   * The current engineering-core calculation contract validates
   * before calculation, so this rule cannot be moved into
   * validateBatterySizing() without changing execution semantics.
   */
  return issues;
}

export function createBatteryConfigurationWarning(
  value: BatterySizingOutput,
): EngineeringIssue[] {
  if (value.totalBatteryUnits === undefined) {
    return [];
  }

  return [
    {
      code: "VERIFY_BATTERY_CONFIGURATION",
      severity: "WARNING",
      message:
        "Verify the calculated battery configuration against the battery manufacturer's specifications and installation requirements.",
      path: "totalBatteryUnits",
      actual: value.totalBatteryUnits,
    },
  ];
}