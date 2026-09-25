import type {
  EngineeringMessage,
  InverterSizingInput,
} from "../types";

import {
  isFiniteNumber,
  validateRequiredPositive,
  validateOptionalPositive,
  validateRequiredUnitInterval,
  validateOptionalUnitInterval,
} from "./rules";

export function validateInverterSizingInput(
  input: InverterSizingInput,
): EngineeringMessage[] {
  const errors: EngineeringMessage[] = [];

  validateRequiredPositive(
    errors,
    "continuousLoadW",
    input.continuousLoadW,
    "INVALID_CONTINUOUS_LOAD",
    "Continuous load must be greater than zero.",
  );

  validateRequiredPositive(
    errors,
    "surgeLoadW",
    input.surgeLoadW,
    "INVALID_SURGE_LOAD",
    "Surge load must be greater than zero.",
  );

  if (
    isFiniteNumber(input.continuousLoadW) &&
    isFiniteNumber(input.surgeLoadW) &&
    input.continuousLoadW > 0 &&
    input.surgeLoadW > 0 &&
    input.surgeLoadW <
      input.continuousLoadW
  ) {
    errors.push({
      code: "INVALID_SURGE_LOAD_RELATIONSHIP",
      field: "surgeLoadW",
      message:
        "Surge load must be greater than or equal to the continuous load.",
      value: input.surgeLoadW,
    });
  }

  validateRequiredPositive(
    errors,
    "systemVoltageV",
    input.systemVoltageV,
    "INVALID_SYSTEM_VOLTAGE",
    "System voltage must be greater than zero.",
  );

  validateRequiredUnitInterval(
    errors,
    "inverterEfficiency",
    input.inverterEfficiency,
    "INVALID_INVERTER_EFFICIENCY",
    "Inverter efficiency must be greater than 0 and no greater than 1.",
  );

  validateOptionalUnitInterval(
    errors,
    "powerFactor",
    input.powerFactor,
    "INVALID_POWER_FACTOR",
    "Power factor must be greater than 0 and no greater than 1.",
  );

  validateOptionalPositive(
    errors,
    "inverterRatedPowerW",
    input.inverterRatedPowerW,
    "INVALID_INVERTER_RATING",
    "Inverter continuous rated power must be greater than zero.",
  );

  validateOptionalPositive(
    errors,
    "inverterSurgePowerW",
    input.inverterSurgePowerW,
    "INVALID_INVERTER_SURGE_RATING",
    "Inverter surge power rating must be greater than zero.",
  );

  if (
    isFiniteNumber(input.inverterRatedPowerW) &&
    isFiniteNumber(input.inverterSurgePowerW) &&
    input.inverterRatedPowerW > 0 &&
    input.inverterSurgePowerW > 0 &&
    input.inverterSurgePowerW <
      input.inverterRatedPowerW
  ) {
    errors.push({
      code:
        "INVALID_INVERTER_SURGE_RELATIONSHIP",
      field: "inverterSurgePowerW",
      message:
        "Inverter surge power rating must be greater than or equal to the continuous rated power.",
      value: input.inverterSurgePowerW,
    });
  }

  validateOptionalPositive(
    errors,
    "inverterInputVoltageMinV",
    input.inverterInputVoltageMinV,
    "INVALID_INPUT_VOLTAGE_MIN",
    "Minimum inverter input voltage must be greater than zero.",
  );

  validateOptionalPositive(
    errors,
    "inverterInputVoltageMaxV",
    input.inverterInputVoltageMaxV,
    "INVALID_INPUT_VOLTAGE_MAX",
    "Maximum inverter input voltage must be greater than zero.",
  );

  if (
    isFiniteNumber(
      input.inverterInputVoltageMinV,
    ) &&
    isFiniteNumber(
      input.inverterInputVoltageMaxV,
    ) &&
    input.inverterInputVoltageMinV > 0 &&
    input.inverterInputVoltageMaxV > 0 &&
    input.inverterInputVoltageMinV >
      input.inverterInputVoltageMaxV
  ) {
    errors.push({
      code: "INVALID_INPUT_VOLTAGE_RANGE",
      field: "inverterInputVoltageMinV",
      message:
        "Minimum inverter input voltage must not exceed the maximum input voltage.",
      value:
        input.inverterInputVoltageMinV,
    });
  }

  validateOptionalPositive(
    errors,
    "requiredOutputVoltageV",
    input.requiredOutputVoltageV,
    "INVALID_REQUIRED_OUTPUT_VOLTAGE",
    "Required output voltage must be greater than zero.",
  );

  validateOptionalPositive(
    errors,
    "inverterOutputVoltageV",
    input.inverterOutputVoltageV,
    "INVALID_INVERTER_OUTPUT_VOLTAGE",
    "Inverter output voltage must be greater than zero.",
  );

  return errors;
}
