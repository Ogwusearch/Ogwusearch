// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/inverter/warnings.ts

import type {
  EngineeringMessage,
  InverterSizingInput,
  InverterSizingValue,
} from "./types";

export function generateInverterSizingWarnings(
  input: InverterSizingInput,
  value: InverterSizingValue
): EngineeringMessage[] {
  const warnings: EngineeringMessage[] = [];

  if (input.inverterEfficiency < 0.85) {
    warnings.push({
      code: "LOW_INVERTER_EFFICIENCY",
      field: "inverterEfficiency",
      message:
        "Inverter efficiency is below 85%; verify the inverter manufacturer's published efficiency under the expected operating load.",
      value: input.inverterEfficiency,
    });
  }

  if (input.powerFactor !== undefined && input.powerFactor < 0.9) {
    warnings.push({
      code: "LOW_POWER_FACTOR",
      field: "powerFactor",
      message:
        "Power factor is below 0.90; verify inverter VA requirements and the characteristics of the connected loads.",
      value: input.powerFactor,
    });
  }

  if (
    input.inverterRatedPowerW !== undefined &&
    value.continuousMarginW !== undefined &&
    value.continuousMarginW >= 0 &&
    value.continuousMarginW <
      value.requiredContinuousOutputPowerW * 0.1
  ) {
    warnings.push({
      code: "LOW_CONTINUOUS_POWER_MARGIN",
      field: "inverterRatedPowerW",
      message:
        "Inverter continuous power margin is below 10%; verify expected load growth, derating, ambient conditions, and manufacturer requirements.",
      value: value.continuousMarginW,
    });
  }

  if (
    input.inverterSurgePowerW !== undefined &&
    value.surgeMarginW !== undefined &&
    value.surgeMarginW >= 0 &&
    value.surgeMarginW <
      value.requiredSurgeOutputPowerW * 0.1
  ) {
    warnings.push({
      code: "LOW_SURGE_POWER_MARGIN",
      field: "inverterSurgePowerW",
      message:
        "Inverter surge power margin is below 10%; verify motor starting currents and other transient loads.",
      value: value.surgeMarginW,
    });
  }

  if (
    input.inverterRatedPowerW !== undefined &&
    value.continuousCompatible === false
  ) {
    warnings.push({
      code: "INSUFFICIENT_CONTINUOUS_CAPACITY",
      field: "inverterRatedPowerW",
      message:
        "The inverter continuous AC power rating is below the calculated continuous load requirement.",
      value: input.inverterRatedPowerW,
    });
  }

  if (
    input.inverterSurgePowerW !== undefined &&
    value.surgeCompatible === false
  ) {
    warnings.push({
      code: "INSUFFICIENT_SURGE_CAPACITY",
      field: "inverterSurgePowerW",
      message:
        "The inverter surge power rating is below the calculated surge load requirement.",
      value: input.inverterSurgePowerW,
    });
  }

  if (
    value.inputVoltageCompatible === false
  ) {
    warnings.push({
      code: "INPUT_VOLTAGE_MISMATCH",
      field: "systemVoltageV",
      message:
        "The system DC voltage is outside the inverter's specified input voltage range.",
      value: input.systemVoltageV,
    });
  }

  if (
    value.outputVoltageCompatible === false
  ) {
    warnings.push({
      code: "OUTPUT_VOLTAGE_MISMATCH",
      field: "inverterOutputVoltageV",
      message:
        "The inverter output voltage does not match the required AC output voltage.",
      value: input.inverterOutputVoltageV,
    });
  }

  if (
    value.requiredContinuousDCInputCurrentA >
    200
  ) {
    warnings.push({
      code: "HIGH_DC_INPUT_CURRENT",
      field: "requiredContinuousDCInputCurrentA",
      message:
        "Calculated continuous DC input current is high; verify battery current capability, DC cable sizing, protection, connectors, and inverter terminal requirements.",
      value:
        value.requiredContinuousDCInputCurrentA,
    });
  }

  if (
    value.systemCompatible === false
  ) {
    warnings.push({
      code: "INVERTER_SYSTEM_INCOMPATIBLE",
      field: "systemCompatible",
      message:
        "One or more supplied inverter compatibility checks have failed.",
      value: value.systemCompatible,
    });
  }

  return warnings;
}