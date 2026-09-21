













// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/inverter/validation.ts

import type {
  EngineeringMessage,
  InverterSizingInput,
} from "./types";

export function validateInverterSizingInput(
  input: InverterSizingInput
): EngineeringMessage[] {
  const errors: EngineeringMessage[] = [];

  const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);

  if (
    !isFiniteNumber(input.continuousLoadW) ||
    input.continuousLoadW <= 0
  ) {
    errors.push({
      code: "INVALID_CONTINUOUS_LOAD",
      field: "continuousLoadW",
      message: "Continuous load must be greater than zero.",
      value: input.continuousLoadW,
    });
  }

  if (
    !isFiniteNumber(input.surgeLoadW) ||
    input.surgeLoadW <= 0
  ) {
    errors.push({
      code: "INVALID_SURGE_LOAD",
      field: "surgeLoadW",
      message: "Surge load must be greater than zero.",
      value: input.surgeLoadW,
    });
  }

  if (
    isFiniteNumber(input.continuousLoadW) &&
    isFiniteNumber(input.surgeLoadW) &&
    input.continuousLoadW > 0 &&
    input.surgeLoadW > 0 &&
    input.surgeLoadW < input.continuousLoadW
  ) {
    errors.push({
      code: "INVALID_SURGE_LOAD_RELATIONSHIP",
      field: "surgeLoadW",
      message:
        "Surge load must be greater than or equal to the continuous load.",
      value: input.surgeLoadW,
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
    !isFiniteNumber(input.inverterEfficiency) ||
    input.inverterEfficiency <= 0 ||
    input.inverterEfficiency > 1
  ) {
    errors.push({
      code: "INVALID_INVERTER_EFFICIENCY",
      field: "inverterEfficiency",
      message:
        "Inverter efficiency must be greater than 0 and no greater than 1.",
      value: input.inverterEfficiency,
    });
  }

  if (
    input.powerFactor !== undefined &&
    (!isFiniteNumber(input.powerFactor) ||
      input.powerFactor <= 0 ||
      input.powerFactor > 1)
  ) {
    errors.push({
      code: "INVALID_POWER_FACTOR",
      field: "powerFactor",
      message:
        "Power factor must be greater than 0 and no greater than 1.",
      value: input.powerFactor,
    });
  }

  if (
    input.inverterRatedPowerW !== undefined &&
    (!isFiniteNumber(input.inverterRatedPowerW) ||
      input.inverterRatedPowerW <= 0)
  ) {
    errors.push({
      code: "INVALID_INVERTER_RATING",
      field: "inverterRatedPowerW",
      message:
        "Inverter continuous rated power must be greater than zero.",
      value: input.inverterRatedPowerW,
    });
  }

  if (
    input.inverterSurgePowerW !== undefined &&
    (!isFiniteNumber(input.inverterSurgePowerW) ||
      input.inverterSurgePowerW <= 0)
  ) {
    errors.push({
      code: "INVALID_INVERTER_SURGE_RATING",
      field: "inverterSurgePowerW",
      message:
        "Inverter surge power rating must be greater than zero.",
      value: input.inverterSurgePowerW,
    });
  }

  if (
    isFiniteNumber(input.inverterRatedPowerW) &&
    isFiniteNumber(input.inverterSurgePowerW) &&
    input.inverterRatedPowerW > 0 &&
    input.inverterSurgePowerW > 0 &&
    input.inverterSurgePowerW < input.inverterRatedPowerW
  ) {
    errors.push({
      code: "INVALID_INVERTER_SURGE_RELATIONSHIP",
      field: "inverterSurgePowerW",
      message:
        "Inverter surge power rating must be greater than or equal to the continuous rated power.",
      value: input.inverterSurgePowerW,
    });
  }

  if (
    input.inverterInputVoltageMinV !== undefined &&
    (!isFiniteNumber(input.inverterInputVoltageMinV) ||
      input.inverterInputVoltageMinV <= 0)
  ) {
    errors.push({
      code: "INVALID_INPUT_VOLTAGE_MIN",
      field: "inverterInputVoltageMinV",
      message:
        "Minimum inverter input voltage must be greater than zero.",
      value: input.inverterInputVoltageMinV,
    });
  }

  if (
    input.inverterInputVoltageMaxV !== undefined &&
    (!isFiniteNumber(input.inverterInputVoltageMaxV) ||
      input.inverterInputVoltageMaxV <= 0)
  ) {
    errors.push({
      code: "INVALID_INPUT_VOLTAGE_MAX",
      field: "inverterInputVoltageMaxV",
      message:
        "Maximum inverter input voltage must be greater than zero.",
      value: input.inverterInputVoltageMaxV,
    });
  }

  if (
    isFiniteNumber(input.inverterInputVoltageMinV) &&
    isFiniteNumber(input.inverterInputVoltageMaxV) &&
    input.inverterInputVoltageMinV > 0 &&
    input.inverterInputVoltageMaxV > 0 &&
    input.inverterInputVoltageMinV > input.inverterInputVoltageMaxV
  ) {
    errors.push({
      code: "INVALID_INPUT_VOLTAGE_RANGE",
      field: "inverterInputVoltageMinV",
      message:
        "Minimum inverter input voltage must not exceed the maximum input voltage.",
      value: input.inverterInputVoltageMinV,
    });
  }

  if (
    input.requiredOutputVoltageV !== undefined &&
    (!isFiniteNumber(input.requiredOutputVoltageV) ||
      input.requiredOutputVoltageV <= 0)
  ) {
    errors.push({
      code: "INVALID_REQUIRED_OUTPUT_VOLTAGE",
      field: "requiredOutputVoltageV",
      message:
        "Required output voltage must be greater than zero.",
      value: input.requiredOutputVoltageV,
    });
  }

  if (
    input.inverterOutputVoltageV !== undefined &&
    (!isFiniteNumber(input.inverterOutputVoltageV) ||
      input.inverterOutputVoltageV <= 0)
  ) {
    errors.push({
      code: "INVALID_INVERTER_OUTPUT_VOLTAGE",
      field: "inverterOutputVoltageV",
      message:
        "Inverter output voltage must be greater than zero.",
      value: input.inverterOutputVoltageV,
    });
  }

  return errors;
}