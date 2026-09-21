// Charge controller errors
// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/charge-controller/errors.ts

import type { EngineeringMessage } from "./types";

export function createChargeControllerSizingError(
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

export const CHARGE_CONTROLLER_SIZING_ERRORS = {
  INVALID_PV_ARRAY_POWER: {
    code: "INVALID_PV_ARRAY_POWER",
    field: "pvArrayPowerW",
    message:
      "PV array power must be greater than zero.",
  },

  INVALID_BATTERY_VOLTAGE: {
    code: "INVALID_BATTERY_VOLTAGE",
    field: "batteryVoltageV",
    message:
      "Battery voltage must be greater than zero.",
  },

  INVALID_CONTROLLER_EFFICIENCY: {
    code: "INVALID_CONTROLLER_EFFICIENCY",
    field: "controllerEfficiency",
    message:
      "Controller efficiency must be greater than 0 and no greater than 1.",
  },

  INVALID_SAFETY_MARGIN: {
    code: "INVALID_SAFETY_MARGIN",
    field: "safetyMargin",
    message:
      "Safety margin cannot be negative.",
  },

  INVALID_PV_ARRAY_VMP: {
    code: "INVALID_PV_ARRAY_VMP",
    field: "pvArrayVmpV",
    message:
      "PV array Vmp must be greater than zero.",
  },

  INVALID_PV_ARRAY_VOC: {
    code: "INVALID_PV_ARRAY_VOC",
    field: "pvArrayVocV",
    message:
      "PV array Voc must be greater than zero.",
  },

  INVALID_PV_ARRAY_IMP: {
    code: "INVALID_PV_ARRAY_IMP",
    field: "pvArrayImpA",
    message:
      "PV array Imp must be greater than zero.",
  },

  INVALID_PV_ARRAY_ISC: {
    code: "INVALID_PV_ARRAY_ISC",
    field: "pvArrayIscA",
    message:
      "PV array Isc must be greater than zero.",
  },

  INVALID_PV_VOLTAGE_RELATIONSHIP: {
    code: "INVALID_PV_VOLTAGE_RELATIONSHIP",
    field: "pvArrayVmpV",
    message:
      "PV array Vmp must not be greater than Voc.",
  },

  INVALID_PV_CURRENT_RELATIONSHIP: {
    code: "INVALID_PV_CURRENT_RELATIONSHIP",
    field: "pvArrayImpA",
    message:
      "PV array Imp must not be greater than Isc.",
  },

  INVALID_CONTROLLER_RATED_CURRENT: {
    code: "INVALID_CONTROLLER_RATED_CURRENT",
    field: "controllerRatedCurrentA",
    message:
      "Controller rated current must be greater than zero.",
  },

  INVALID_CONTROLLER_MAX_PV_VOLTAGE: {
    code: "INVALID_CONTROLLER_MAX_PV_VOLTAGE",
    field: "controllerMaxPVVoltageV",
    message:
      "Controller maximum PV voltage must be greater than zero.",
  },

  INVALID_MPPT_MIN_VOLTAGE: {
    code: "INVALID_MPPT_MIN_VOLTAGE",
    field: "controllerMPPTMinVoltageV",
    message:
      "Controller minimum MPPT voltage must be greater than zero.",
  },

  INVALID_MPPT_MAX_VOLTAGE: {
    code: "INVALID_MPPT_MAX_VOLTAGE",
    field: "controllerMPPTMaxVoltageV",
    message:
      "Controller maximum MPPT voltage must be greater than zero.",
  },

  INVALID_MPPT_VOLTAGE_RANGE: {
    code: "INVALID_MPPT_VOLTAGE_RANGE",
    field: "controllerMPPTMinVoltageV",
    message:
      "Minimum MPPT voltage must not exceed maximum MPPT voltage.",
  },

  INVALID_CONTROLLER_MAX_PV_CURRENT: {
    code: "INVALID_CONTROLLER_MAX_PV_CURRENT",
    field: "controllerMaxPVCurrentA",
    message:
      "Controller maximum PV input current must be greater than zero.",
  },
} as const;