// Charge controller input validation
// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/charge-controller/validation.ts

import type {
  ChargeControllerSizingInput,
  EngineeringMessage,
} from "./types";

export function validateChargeControllerSizingInput(
  input: ChargeControllerSizingInput
): EngineeringMessage[] {
  const errors: EngineeringMessage[] = [];

  const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" &&
    Number.isFinite(value);

  if (
    !isFiniteNumber(input.pvArrayPowerW) ||
    input.pvArrayPowerW <= 0
  ) {
    errors.push({
      code: "INVALID_PV_ARRAY_POWER",
      field: "pvArrayPowerW",
      message: "PV array power must be greater than zero.",
      value: input.pvArrayPowerW,
    });
  }

  if (
    !isFiniteNumber(input.batteryVoltageV) ||
    input.batteryVoltageV <= 0
  ) {
    errors.push({
      code: "INVALID_BATTERY_VOLTAGE",
      field: "batteryVoltageV",
      message: "Battery voltage must be greater than zero.",
      value: input.batteryVoltageV,
    });
  }

  if (
    !isFiniteNumber(input.controllerEfficiency) ||
    input.controllerEfficiency <= 0 ||
    input.controllerEfficiency > 1
  ) {
    errors.push({
      code: "INVALID_CONTROLLER_EFFICIENCY",
      field: "controllerEfficiency",
      message:
        "Controller efficiency must be greater than 0 and no greater than 1.",
      value: input.controllerEfficiency,
    });
  }

  if (
    !isFiniteNumber(input.safetyMargin) ||
    input.safetyMargin < 0
  ) {
    errors.push({
      code: "INVALID_SAFETY_MARGIN",
      field: "safetyMargin",
      message: "Safety margin cannot be negative.",
      value: input.safetyMargin,
    });
  }

  if (
    input.pvArrayVmpV !== undefined &&
    (!isFiniteNumber(input.pvArrayVmpV) ||
      input.pvArrayVmpV <= 0)
  ) {
    errors.push({
      code: "INVALID_PV_ARRAY_VMP",
      field: "pvArrayVmpV",
      message:
        "PV array Vmp must be greater than zero.",
      value: input.pvArrayVmpV,
    });
  }

  if (
    input.pvArrayVocV !== undefined &&
    (!isFiniteNumber(input.pvArrayVocV) ||
      input.pvArrayVocV <= 0)
  ) {
    errors.push({
      code: "INVALID_PV_ARRAY_VOC",
      field: "pvArrayVocV",
      message:
        "PV array Voc must be greater than zero.",
      value: input.pvArrayVocV,
    });
  }

  if (
    input.pvArrayImpA !== undefined &&
    (!isFiniteNumber(input.pvArrayImpA) ||
      input.pvArrayImpA <= 0)
  ) {
    errors.push({
      code: "INVALID_PV_ARRAY_IMP",
      field: "pvArrayImpA",
      message:
        "PV array Imp must be greater than zero.",
      value: input.pvArrayImpA,
    });
  }

  if (
    input.pvArrayIscA !== undefined &&
    (!isFiniteNumber(input.pvArrayIscA) ||
      input.pvArrayIscA <= 0)
  ) {
    errors.push({
      code: "INVALID_PV_ARRAY_ISC",
      field: "pvArrayIscA",
      message:
        "PV array Isc must be greater than zero.",
      value: input.pvArrayIscA,
    });
  }

  if (
    isFiniteNumber(input.pvArrayVmpV) &&
    isFiniteNumber(input.pvArrayVocV) &&
    input.pvArrayVmpV > 0 &&
    input.pvArrayVocV > 0 &&
    input.pvArrayVmpV > input.pvArrayVocV
  ) {
    errors.push({
      code: "INVALID_PV_VOLTAGE_RELATIONSHIP",
      field: "pvArrayVmpV",
      message:
        "PV array Vmp must not be greater than Voc.",
      value: input.pvArrayVmpV,
    });
  }

  if (
    isFiniteNumber(input.pvArrayImpA) &&
    isFiniteNumber(input.pvArrayIscA) &&
    input.pvArrayImpA > 0 &&
    input.pvArrayIscA > 0 &&
    input.pvArrayImpA > input.pvArrayIscA
  ) {
    errors.push({
      code: "INVALID_PV_CURRENT_RELATIONSHIP",
      field: "pvArrayImpA",
      message:
        "PV array Imp must not be greater than Isc.",
      value: input.pvArrayImpA,
    });
  }

  if (
    input.controllerRatedCurrentA !== undefined &&
    (!isFiniteNumber(input.controllerRatedCurrentA) ||
      input.controllerRatedCurrentA <= 0)
  ) {
    errors.push({
      code: "INVALID_CONTROLLER_RATED_CURRENT",
      field: "controllerRatedCurrentA",
      message:
        "Controller rated current must be greater than zero.",
      value: input.controllerRatedCurrentA,
    });
  }

  if (
    input.controllerMaxPVVoltageV !== undefined &&
    (!isFiniteNumber(input.controllerMaxPVVoltageV) ||
      input.controllerMaxPVVoltageV <= 0)
  ) {
    errors.push({
      code: "INVALID_CONTROLLER_MAX_PV_VOLTAGE",
      field: "controllerMaxPVVoltageV",
      message:
        "Controller maximum PV voltage must be greater than zero.",
      value: input.controllerMaxPVVoltageV,
    });
  }

  if (
    input.controllerMPPTMinVoltageV !== undefined &&
    (!isFiniteNumber(input.controllerMPPTMinVoltageV) ||
      input.controllerMPPTMinVoltageV <= 0)
  ) {
    errors.push({
      code: "INVALID_MPPT_MIN_VOLTAGE",
      field: "controllerMPPTMinVoltageV",
      message:
        "Controller minimum MPPT voltage must be greater than zero.",
      value: input.controllerMPPTMinVoltageV,
    });
  }

  if (
    input.controllerMPPTMaxVoltageV !== undefined &&
    (!isFiniteNumber(input.controllerMPPTMaxVoltageV) ||
      input.controllerMPPTMaxVoltageV <= 0)
  ) {
    errors.push({
      code: "INVALID_MPPT_MAX_VOLTAGE",
      field: "controllerMPPTMaxVoltageV",
      message:
        "Controller maximum MPPT voltage must be greater than zero.",
      value: input.controllerMPPTMaxVoltageV,
    });
  }

  if (
    isFiniteNumber(input.controllerMPPTMinVoltageV) &&
    isFiniteNumber(input.controllerMPPTMaxVoltageV) &&
    input.controllerMPPTMinVoltageV > 0 &&
    input.controllerMPPTMaxVoltageV > 0 &&
    input.controllerMPPTMinVoltageV >
      input.controllerMPPTMaxVoltageV
  ) {
    errors.push({
      code: "INVALID_MPPT_VOLTAGE_RANGE",
      field: "controllerMPPTMinVoltageV",
      message:
        "Minimum MPPT voltage must not exceed maximum MPPT voltage.",
      value: input.controllerMPPTMinVoltageV,
    });
  }

  if (
    input.controllerMaxPVCurrentA !== undefined &&
    (!isFiniteNumber(input.controllerMaxPVCurrentA) ||
      input.controllerMaxPVCurrentA <= 0)
  ) {
    errors.push({
      code: "INVALID_CONTROLLER_MAX_PV_CURRENT",
      field: "controllerMaxPVCurrentA",
      message:
        "Controller maximum PV input current must be greater than zero.",
      value: input.controllerMaxPVCurrentA,
    });
  }

  return errors;
}