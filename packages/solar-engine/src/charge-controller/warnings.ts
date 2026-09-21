// Charge controller warnings
// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/charge-controller/warnings.ts

import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
  EngineeringMessage,
} from "./types";

export function generateChargeControllerSizingWarnings(
  input: ChargeControllerSizingInput,
  value: ChargeControllerSizingValue
): EngineeringMessage[] {
  const warnings: EngineeringMessage[] = [];

  if (input.controllerEfficiency < 0.9) {
    warnings.push({
      code: "LOW_CONTROLLER_EFFICIENCY",
      field: "controllerEfficiency",
      message:
        "Charge controller efficiency is below 90%; verify the manufacturer's efficiency under the expected operating conditions.",
      value: input.controllerEfficiency,
    });
  }

  if (input.safetyMargin === 0) {
    warnings.push({
      code: "NO_SAFETY_MARGIN",
      field: "safetyMargin",
      message:
        "No additional charge-controller safety margin has been applied.",
      value: input.safetyMargin,
    });
  }

  if (
    input.controllerRatedCurrentA !== undefined &&
    value.controllerCurrentMarginA !== undefined &&
    value.controllerCurrentMarginA >= 0 &&
    value.controllerCurrentMarginA <
      value.requiredControllerCurrentA * 0.1
  ) {
    warnings.push({
      code: "LOW_CONTROLLER_CURRENT_MARGIN",
      field: "controllerRatedCurrentA",
      message:
        "Charge-controller current margin is below 10%; verify temperature derating, continuous operating conditions, and manufacturer requirements.",
      value: value.controllerCurrentMarginA,
    });
  }

  if (
    value.currentCompatible === false
  ) {
    warnings.push({
      code: "INSUFFICIENT_CONTROLLER_CURRENT",
      field: "controllerRatedCurrentA",
      message:
        "The charge controller rated current is below the required controller current.",
      value: input.controllerRatedCurrentA,
    });
  }

  if (
    value.voltageCompatible === false
  ) {
    warnings.push({
      code: "PV_VOLTAGE_EXCEEDS_CONTROLLER_LIMIT",
      field: "pvArrayVocV",
      message:
        "PV array open-circuit voltage exceeds the controller's maximum PV input voltage.",
      value: input.pvArrayVocV,
    });
  }

  if (
    value.mpptCompatible === false
  ) {
    warnings.push({
      code: "PV_VOLTAGE_OUTSIDE_MPPT_RANGE",
      field: "pvArrayVmpV",
      message:
        "PV array operating voltage is outside the charge controller's MPPT operating range.",
      value: input.pvArrayVmpV,
    });
  }

  if (
    value.pvCurrentCompatible === false
  ) {
    warnings.push({
      code: "PV_CURRENT_EXCEEDS_CONTROLLER_LIMIT",
      field: "pvArrayIscA",
      message:
        "PV array input current exceeds the charge controller's maximum PV input current.",
      value:
        input.pvArrayIscA ??
        input.pvArrayImpA,
    });
  }

  if (
    value.requiredControllerCurrentA >
    100
  ) {
    warnings.push({
      code: "HIGH_CONTROLLER_CURRENT",
      field: "requiredControllerCurrentA",
      message:
        "Required controller charging current is high; verify battery charge acceptance, controller terminal ratings, cable sizing, and DC protection.",
      value:
        value.requiredControllerCurrentA,
    });
  }

  if (
    input.batteryVoltageV >= 48 &&
    value.requiredControllerCurrentA > 100
  ) {
    warnings.push({
      code: "HIGH_POWER_CHARGING_SYSTEM",
      field: "batteryVoltageV",
      message:
        "The calculated charging system operates at high current; verify thermal management, conductor sizing, protection, and controller installation requirements.",
      value: input.batteryVoltageV,
    });
  }

  if (
    input.pvArrayVocV !== undefined &&
    input.controllerMaxPVVoltageV !== undefined &&
    value.voltageCompatible === true
  ) {
    const voltageMarginV =
      input.controllerMaxPVVoltageV -
      input.pvArrayVocV;

    if (
      voltageMarginV <
      input.controllerMaxPVVoltageV * 0.1
    ) {
      warnings.push({
        code: "LOW_PV_VOLTAGE_MARGIN",
        field: "controllerMaxPVVoltageV",
        message:
          "PV array open-circuit voltage is within 10% of the controller maximum PV input voltage; verify cold-weather Voc conditions and manufacturer limits.",
        value: voltageMarginV,
      });
    }
  }

  if (
    value.systemCompatible === false
  ) {
    warnings.push({
      code: "CHARGE_CONTROLLER_SYSTEM_INCOMPATIBLE",
      field: "systemCompatible",
      message:
        "One or more supplied charge-controller compatibility checks have failed.",
      value: value.systemCompatible,
    });
  }

  return warnings;
}