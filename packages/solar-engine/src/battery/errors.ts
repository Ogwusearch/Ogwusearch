import type { EngineeringMessage } from "./types";

export function createBatterySizingError(
  code: string,
  field: string,
  message: string,
  value?: unknown
): EngineeringMessage {
  const error: EngineeringMessage = {
    code,
    field,
    message,
  };

  if (value !== undefined) {
    error.value = value;
  }

  return error;
}

export const BATTERY_SIZING_ERRORS = {
  INVALID_DAILY_ENERGY: {
    code: "INVALID_DAILY_ENERGY",
    field: "dailyEnergyKWh",
    message: "Daily energy must be greater than zero.",
  },

  INVALID_AUTONOMY: {
    code: "INVALID_AUTONOMY",
    field: "autonomyDays",
    message: "Autonomy days must be greater than zero.",
  },

  INVALID_SYSTEM_VOLTAGE: {
    code: "INVALID_SYSTEM_VOLTAGE",
    field: "systemVoltageV",
    message: "System voltage must be greater than zero.",
  },

  INVALID_DEPTH_OF_DISCHARGE: {
    code: "INVALID_DEPTH_OF_DISCHARGE",
    field: "depthOfDischarge",
    message:
      "Depth of discharge must be greater than 0 and no greater than 1.",
  },

  INVALID_BATTERY_EFFICIENCY: {
    code: "INVALID_BATTERY_EFFICIENCY",
    field: "batteryEfficiency",
    message:
      "Battery efficiency must be greater than 0 and no greater than 1.",
  },

  INVALID_DESIGN_MARGIN: {
    code: "INVALID_DESIGN_MARGIN",
    field: "designMargin",
    message: "Design margin cannot be negative.",
  },

  INVALID_BATTERY_UNIT_VOLTAGE: {
    code: "INVALID_BATTERY_UNIT_VOLTAGE",
    field: "batteryUnitVoltageV",
    message:
      "Battery unit voltage must be greater than zero.",
  },

  INVALID_BATTERY_UNIT_CAPACITY: {
    code: "INVALID_BATTERY_UNIT_CAPACITY",
    field: "batteryUnitCapacityAh",
    message:
      "Battery unit capacity must be greater than zero.",
  },
} as const;