import type {
  InverterSizingInput,
  InverterSizingValue,
} from "../types";

import {
  calculateACOutput,
} from "./calculate-ac-output";

import {
  calculateDCInput,
} from "./calculate-dc-input";

import {
  calculateInverterCapacity,
} from "./calculate-inverter-capacity";

export function calculateInverterSizing(
  input: InverterSizingInput,
): InverterSizingValue {
  const acOutput =
    calculateACOutput(input);

  const dcInput =
    calculateDCInput(input);

  const capacity =
    calculateInverterCapacity(
      input,
      acOutput.requiredContinuousOutputPowerW,
      acOutput.requiredSurgeOutputPowerW,
    );

  const result: InverterSizingValue = {
    ...acOutput,
    ...dcInput,
    ...capacity,
  };

  if (
    input.inverterInputVoltageMinV !== undefined &&
    input.inverterInputVoltageMaxV !== undefined
  ) {
    result.inputVoltageCompatible =
      input.systemVoltageV >=
        input.inverterInputVoltageMinV &&
      input.systemVoltageV <=
        input.inverterInputVoltageMaxV;
  }

  if (
    input.requiredOutputVoltageV !== undefined &&
    input.inverterOutputVoltageV !== undefined
  ) {
    result.outputVoltageCompatible =
      input.requiredOutputVoltageV ===
      input.inverterOutputVoltageV;
  }

  const compatibilityChecks: boolean[] = [];

  if (
    result.continuousCompatible !==
    undefined
  ) {
    compatibilityChecks.push(
      result.continuousCompatible,
    );
  }

  if (
    result.surgeCompatible !==
    undefined
  ) {
    compatibilityChecks.push(
      result.surgeCompatible,
    );
  }

  if (
    result.inputVoltageCompatible !==
    undefined
  ) {
    compatibilityChecks.push(
      result.inputVoltageCompatible,
    );
  }

  if (
    result.outputVoltageCompatible !==
    undefined
  ) {
    compatibilityChecks.push(
      result.outputVoltageCompatible,
    );
  }

  if (compatibilityChecks.length > 0) {
    result.systemCompatible =
      compatibilityChecks.every(Boolean);
  }

  return result;
}