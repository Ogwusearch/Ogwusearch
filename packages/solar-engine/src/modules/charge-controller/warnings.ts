import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "./types/index.js";

import {
  CHARGE_CONTROLLER_CONSTANTS,
} from "./constants.js";

export interface ChargeControllerSizingWarning {
  readonly code: string;
  readonly field?: string;
  readonly message: string;
  readonly value?: unknown;
}

export function generateChargeControllerSizingWarnings(
  input: ChargeControllerSizingInput,
  value: ChargeControllerSizingValue,
): ChargeControllerSizingWarning[] {
  const warnings: ChargeControllerSizingWarning[] = [];

  if (
    input.controllerEfficiency <
    CHARGE_CONTROLLER_CONSTANTS.LOW_EFFICIENCY_THRESHOLD
  ) {
    warnings.push({
      code: "LOW_CONTROLLER_EFFICIENCY",
      field: "controllerEfficiency",
      message:
        "Charge controller efficiency is below the recommended threshold.",
      value: input.controllerEfficiency,
    });
  }

  if (input.safetyMargin === 0) {
    warnings.push({
      code: "NO_SAFETY_MARGIN",
      field: "safetyMargin",
      message:
        "No design safety margin has been applied to the charge-controller sizing.",
      value: input.safetyMargin,
    });
  }

  if (
    value.controllerCurrentMarginA !== undefined &&
    value.requiredControllerCurrentA > 0 &&
    value.controllerCurrentMarginA >= 0 &&
    value.controllerCurrentMarginA <
      value.requiredControllerCurrentA *
        CHARGE_CONTROLLER_CONSTANTS.LOW_CURRENT_MARGIN_RATIO
  ) {
    warnings.push({
      code: "LOW_CONTROLLER_CURRENT_MARGIN",
      field: "controllerCurrentMarginA",
      message:
        "Controller current margin is low relative to the required controller current.",
      value: value.controllerCurrentMarginA,
    });
  }

  if (value.currentCompatible === false) {
    warnings.push({
      code: "INSUFFICIENT_CONTROLLER_CURRENT",
      field: "controllerRatedCurrentA",
      message:
        "Controller rated current is insufficient for the required controller current.",
      value: value.controllerRatedCurrentA,
    });
  }

  if (value.voltageCompatible === false) {
    warnings.push({
      code: "PV_VOLTAGE_EXCEEDS_CONTROLLER_LIMIT",
      field: "pvArrayVocV",
      message:
        "PV array open-circuit voltage exceeds the controller PV voltage limit.",
      value: input.pvArrayVocV,
    });
  }

  if (value.mpptCompatible === false) {
    warnings.push({
      code: "PV_VOLTAGE_OUTSIDE_MPPT_RANGE",
      field: "pvArrayVmpV",
      message:
        "PV array operating voltage is outside the controller MPPT voltage range.",
      value: input.pvArrayVmpV,
    });
  }

  if (value.pvCurrentCompatible === false) {
    warnings.push({
      code: "PV_CURRENT_EXCEEDS_CONTROLLER_LIMIT",
      field: "pvArrayIscA",
      message:
        "PV array input current exceeds the controller PV current limit.",
      value: value.pvArrayIscA ?? value.pvArrayImpA,
    });
  }

  if (
    value.requiredControllerCurrentA >
    CHARGE_CONTROLLER_CONSTANTS.HIGH_CONTROLLER_CURRENT_A
  ) {
    warnings.push({
      code: "HIGH_CONTROLLER_CURRENT",
      field: "requiredControllerCurrentA",
      message:
        "Required charge-controller current is high and should receive engineering review.",
      value: value.requiredControllerCurrentA,
    });
  }

  if (
    input.batteryVoltageV >=
      CHARGE_CONTROLLER_CONSTANTS.HIGH_VOLTAGE_SYSTEM_V &&
    value.requiredControllerCurrentA >
      CHARGE_CONTROLLER_CONSTANTS.HIGH_CONTROLLER_CURRENT_A
  ) {
    warnings.push({
      code: "HIGH_POWER_CHARGING_SYSTEM",
      field: "requiredControllerCurrentA",
      message:
        "The charging system operates at high battery voltage and high controller current.",
      value: value.requiredControllerCurrentA,
    });
  }

  if (
    input.pvArrayVocV !== undefined &&
    input.controllerMaxPVVoltageV !== undefined &&
    input.pvArrayVocV <= input.controllerMaxPVVoltageV &&
    input.pvArrayVocV >=
      input.controllerMaxPVVoltageV * (1 - 0.1)
  ) {
    warnings.push({
      code: "LOW_PV_VOLTAGE_MARGIN",
      field: "pvArrayVocV",
      message:
        "PV open-circuit voltage is close to the controller maximum PV voltage.",
      value: input.pvArrayVocV,
    });
  }

  if (value.systemCompatible === false) {
    warnings.push({
      code: "CHARGE_CONTROLLER_SYSTEM_INCOMPATIBLE",
      field: "systemCompatible",
      message:
        "One or more supplied charge-controller compatibility checks failed.",
      value: value.systemCompatible,
    });
  }

  return warnings;
}