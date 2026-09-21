// Charge controller engine
// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/charge-controller/index.ts

import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingResult,
  ChargeControllerSizingTrace,
  ChargeControllerSizingValue,
} from "./types";

import { validateChargeControllerSizingInput } from "./validation";
import { calculateChargeControllerSizing } from "./calculations";
import { generateChargeControllerSizingWarnings } from "./warnings";

const ENGINE_VERSION = "1.0.0";

export function calculateChargeControllerSizingResult(
  input: ChargeControllerSizingInput
): ChargeControllerSizingResult {
  const metadata = {
    engine: "charge-controller-sizing" as const,
    version: ENGINE_VERSION,
    unitSystem: "SI" as const,
  };

  const errors =
    validateChargeControllerSizingInput(input);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      warnings: [],
      metadata,
    };
  }

  const value: ChargeControllerSizingValue =
    calculateChargeControllerSizing(input);

  const warnings =
    generateChargeControllerSizingWarnings(
      input,
      value
    );

  const calculations: ChargeControllerSizingTrace["calculations"] =
    {
      pvArrayPowerW: input.pvArrayPowerW,
      batteryVoltageV: input.batteryVoltageV,
      controllerEfficiency:
        input.controllerEfficiency,
      safetyMargin: input.safetyMargin,

      pvChargingCurrentA:
        value.pvChargingCurrentA,

      controllerOutputCurrentA:
        value.controllerOutputCurrentA,

      requiredControllerCurrentA:
        value.requiredControllerCurrentA,
    };

  if (input.pvArrayVmpV !== undefined) {
    calculations.pvArrayVmpV =
      input.pvArrayVmpV;
  }

  if (input.pvArrayVocV !== undefined) {
    calculations.pvArrayVocV =
      input.pvArrayVocV;
  }

  if (input.pvArrayImpA !== undefined) {
    calculations.pvArrayImpA =
      input.pvArrayImpA;
  }

  if (input.pvArrayIscA !== undefined) {
    calculations.pvArrayIscA =
      input.pvArrayIscA;
  }

  if (
    input.controllerRatedCurrentA !== undefined
  ) {
    calculations.controllerRatedCurrentA =
      input.controllerRatedCurrentA;
  }

  if (
    input.controllerMaxPVVoltageV !== undefined
  ) {
    calculations.controllerMaxPVVoltageV =
      input.controllerMaxPVVoltageV;
  }

  if (
    input.controllerMPPTMinVoltageV !== undefined
  ) {
    calculations.controllerMPPTMinVoltageV =
      input.controllerMPPTMinVoltageV;
  }

  if (
    input.controllerMPPTMaxVoltageV !== undefined
  ) {
    calculations.controllerMPPTMaxVoltageV =
      input.controllerMPPTMaxVoltageV;
  }

  if (
    input.controllerMaxPVCurrentA !== undefined
  ) {
    calculations.controllerMaxPVCurrentA =
      input.controllerMaxPVCurrentA;
  }

  if (
    value.requiredControllerPowerW !==
    undefined
  ) {
    calculations.requiredControllerPowerW =
      value.requiredControllerPowerW;
  }

  if (
    value.controllerCurrentMarginA !==
    undefined
  ) {
    calculations.controllerCurrentMarginA =
      value.controllerCurrentMarginA;
  }

  if (value.currentCompatible !== undefined) {
    calculations.currentCompatible =
      value.currentCompatible;
  }

  if (value.voltageCompatible !== undefined) {
    calculations.voltageCompatible =
      value.voltageCompatible;
  }

  if (value.mpptCompatible !== undefined) {
    calculations.mpptCompatible =
      value.mpptCompatible;
  }

  if (
    value.pvCurrentCompatible !== undefined
  ) {
    calculations.pvCurrentCompatible =
      value.pvCurrentCompatible;
  }

  if (value.systemCompatible !== undefined) {
    calculations.systemCompatible =
      value.systemCompatible;
  }

  const trace: ChargeControllerSizingTrace = {
    formulas: {
      pvChargingCurrentA:
        "pvChargingCurrentA = pvArrayPowerW / batteryVoltageV",

      controllerOutputCurrentA:
        "controllerOutputCurrentA = (pvArrayPowerW × controllerEfficiency) / batteryVoltageV",

      requiredControllerCurrentA:
        "requiredControllerCurrentA = controllerOutputCurrentA × (1 + safetyMargin)",

      requiredControllerPowerW:
        "requiredControllerPowerW = controllerOutputCurrentA × batteryVoltageV × (1 + safetyMargin)",

      controllerCurrentMarginA:
        "controllerCurrentMarginA = controllerRatedCurrentA - requiredControllerCurrentA",

      currentCompatible:
        "currentCompatible = controllerRatedCurrentA >= requiredControllerCurrentA",

      voltageCompatible:
        "voltageCompatible = pvArrayVocV <= controllerMaxPVVoltageV",

      mpptCompatible:
        "mpptCompatible = controllerMPPTMinVoltageV <= pvArrayVmpV AND pvArrayVmpV <= controllerMPPTMaxVoltageV",

      pvCurrentCompatible:
        "pvCurrentCompatible = pvArrayIscV <= controllerMaxPVCurrentA",

      systemCompatible:
        "systemCompatible = every supplied compatibility check is true",
    },

    assumptions: [
      "PV array power is represented in watts.",
      "Battery voltage is represented in volts.",
      "Controller efficiency is represented as a decimal between 0 and 1.",
      "Safety margin is represented as a decimal.",
      "PV charging current is estimated from PV array power and nominal battery voltage.",
      "Controller output current accounts for controller efficiency.",
      "Controller current sizing applies the supplied safety margin.",
      "PV open-circuit voltage is checked against the controller maximum PV input voltage.",
      "PV operating voltage is checked against the controller MPPT voltage range.",
      "PV short-circuit current is preferred for maximum PV input-current compatibility when supplied.",
      "Optional compatibility checks are evaluated independently.",
    ],

    calculations,
  };

  return {
    success: true,
    value,
    errors: [],
    warnings,
    trace,
    metadata,
  };
}

export { calculateChargeControllerSizing };

export type {
  ChargeControllerSizingInput,
  ChargeControllerSizingResult,
  ChargeControllerSizingValue,
};