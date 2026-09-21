import type {
  BatterySizingInput,
  EngineeringMessage,
} from "./types";

export function validateBatterySizingInput(
  input: BatterySizingInput
): EngineeringMessage[] {
  const errors: EngineeringMessage[] = [];

  const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" &&
    Number.isFinite(value);

  if (
    !isFiniteNumber(input.dailyEnergyKWh) ||
    input.dailyEnergyKWh <= 0
  ) {
    errors.push({
      code: "INVALID_DAILY_ENERGY",
      field: "dailyEnergyKWh",
      message: "Daily energy must be greater than zero.",
      value: input.dailyEnergyKWh,
    });
  }

  if (
    !isFiniteNumber(input.autonomyDays) ||
    input.autonomyDays <= 0
  ) {
    errors.push({
      code: "INVALID_AUTONOMY",
      field: "autonomyDays",
      message: "Autonomy days must be greater than zero.",
      value: input.autonomyDays,
    });
  }

  if (
    !isFiniteNumber(input.systemVoltageV) ||
    input.systemVoltageV <= 0
  ) {
    errors.push({
      code: "INVALID_SYSTEM_VOLTAGE",
      field: "systemVoltageV",
      message: "System voltage must be greater than zero.",
      value: input.systemVoltageV,
    });
  }

  if (
    !isFiniteNumber(input.depthOfDischarge) ||
    input.depthOfDischarge <= 0 ||
    input.depthOfDischarge > 1
  ) {
    errors.push({
      code: "INVALID_DEPTH_OF_DISCHARGE",
      field: "depthOfDischarge",
      message: "Depth of discharge must be greater than 0 and no greater than 1.",
      value: input.depthOfDischarge,
    });
  }

  if (
    !isFiniteNumber(input.batteryEfficiency) ||
    input.batteryEfficiency <= 0 ||
    input.batteryEfficiency > 1
  ) {
    errors.push({
      code: "INVALID_BATTERY_EFFICIENCY",
      field: "batteryEfficiency",
      message: "Battery efficiency must be greater than 0 and no greater than 1.",
      value: input.batteryEfficiency,
    });
  }

  if (
    !isFiniteNumber(input.designMargin) ||
    input.designMargin < 0
  ) {
    errors.push({
      code: "INVALID_DESIGN_MARGIN",
      field: "designMargin",
      message: "Design margin cannot be negative.",
      value: input.designMargin,
    });
  }

  if (
    input.batteryUnitVoltageV !== undefined &&
    (!isFiniteNumber(input.batteryUnitVoltageV) ||
      input.batteryUnitVoltageV <= 0)
  ) {
    errors.push({
      code: "INVALID_BATTERY_UNIT_VOLTAGE",
      field: "batteryUnitVoltageV",
      message: "Battery unit voltage must be greater than zero.",
      value: input.batteryUnitVoltageV,
    });
  }

  if (
    input.batteryUnitCapacityAh !== undefined &&
    (!isFiniteNumber(input.batteryUnitCapacityAh) ||
      input.batteryUnitCapacityAh <= 0)
  ) {
    errors.push({
      code: "INVALID_BATTERY_UNIT_CAPACITY",
      field: "batteryUnitCapacityAh",
      message: "Battery unit capacity must be greater than zero.",
      value: input.batteryUnitCapacityAh,
    });
  }

  return errors;
}