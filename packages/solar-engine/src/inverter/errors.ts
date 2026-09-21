// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/inverter/errors.ts

import type { EngineeringMessage } from "./types";

export function createInverterSizingError(
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

export const INVERTER_SIZING_ERRORS = {
  INVALID_CONTINUOUS_LOAD: {
    code: "INVALID_CONTINUOUS_LOAD",
    field: "continuousLoadW",
    message: "Continuous load must be greater than zero.",
  },

  INVALID_SURGE_LOAD: {
    code: "INVALID_SURGE_LOAD",
    field: "surgeLoadW",
    message: "Surge load must be greater than zero.",
  },

  INVALID_SURGE_LOAD_RELATIONSHIP: {
    code: "INVALID_SURGE_LOAD_RELATIONSHIP",
    field: "surgeLoadW",
    message:
      "Surge load must be greater than or equal to the continuous load.",
  },

  INVALID_SYSTEM_VOLTAGE: {
    code: "INVALID_SYSTEM_VOLTAGE",
    field: "systemVoltageV",
    message: "System voltage must be greater than zero.",
  },

  INVALID_INVERTER_EFFICIENCY: {
    code: "INVALID_INVERTER_EFFICIENCY",
    field: "inverterEfficiency",
    message:
      "Inverter efficiency must be greater than 0 and no greater than 1.",
  },

  INVALID_POWER_FACTOR: {
    code: "INVALID_POWER_FACTOR",
    field: "powerFactor",
    message:
      "Power factor must be greater than 0 and no greater than 1.",
  },

  INVALID_INVERTER_RATING: {
    code: "INVALID_INVERTER_RATING",
    field: "inverterRatedPowerW",
    message:
      "Inverter continuous rated power must be greater than zero.",
  },

  INVALID_INVERTER_SURGE_RATING: {
    code: "INVALID_INVERTER_SURGE_RATING",
    field: "inverterSurgePowerW",
    message:
      "Inverter surge power rating must be greater than zero.",
  },

  INVALID_INVERTER_SURGE_RELATIONSHIP: {
    code: "INVALID_INVERTER_SURGE_RELATIONSHIP",
    field: "inverterSurgePowerW",
    message:
      "Inverter surge power rating must be greater than or equal to the continuous rated power.",
  },

  INVALID_INPUT_VOLTAGE_MIN: {
    code: "INVALID_INPUT_VOLTAGE_MIN",
    field: "inverterInputVoltageMinV",
    message:
      "Minimum inverter input voltage must be greater than zero.",
  },

  INVALID_INPUT_VOLTAGE_MAX: {
    code: "INVALID_INPUT_VOLTAGE_MAX",
    field: "inverterInputVoltageMaxV",
    message:
      "Maximum inverter input voltage must be greater than zero.",
  },

  INVALID_INPUT_VOLTAGE_RANGE: {
    code: "INVALID_INPUT_VOLTAGE_RANGE",
    field: "inverterInputVoltageMinV",
    message:
      "Minimum inverter input voltage must not exceed the maximum input voltage.",
  },

  INVALID_REQUIRED_OUTPUT_VOLTAGE: {
    code: "INVALID_REQUIRED_OUTPUT_VOLTAGE",
    field: "requiredOutputVoltageV",
    message:
      "Required output voltage must be greater than zero.",
  },

  INVALID_INVERTER_OUTPUT_VOLTAGE: {
    code: "INVALID_INVERTER_OUTPUT_VOLTAGE",
    field: "inverterOutputVoltageV",
    message:
      "Inverter output voltage must be greater than zero.",
  },
} as const;