// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/inverter/index.ts

import type {
  InverterSizingInput,
  InverterSizingResult,
  InverterSizingTrace,
  InverterSizingValue,
} from "./types";

import { validateInverterSizingInput } from "./validation";
import { calculateInverterSizing } from "./calculations";
import { generateInverterSizingWarnings } from "./warnings";

const ENGINE_VERSION = "1.0.0";

export function calculateInverterSizingResult(
  input: InverterSizingInput
): InverterSizingResult {
  const metadata = {
    engine: "inverter-sizing" as const,
    version: ENGINE_VERSION,
    unitSystem: "SI" as const,
  };

  const errors = validateInverterSizingInput(input);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      warnings: [],
      metadata,
    };
  }

  const value: InverterSizingValue =
    calculateInverterSizing(input);

  const warnings =
    generateInverterSizingWarnings(input, value);

  const calculations: InverterSizingTrace["calculations"] = {
    continuousLoadW: input.continuousLoadW,
    surgeLoadW: input.surgeLoadW,
    systemVoltageV: input.systemVoltageV,
    inverterEfficiency: input.inverterEfficiency,

    requiredContinuousOutputPowerW:
      value.requiredContinuousOutputPowerW,

    requiredSurgeOutputPowerW:
      value.requiredSurgeOutputPowerW,

    requiredContinuousInputPowerW:
      value.requiredContinuousInputPowerW,

    requiredSurgeInputPowerW:
      value.requiredSurgeInputPowerW,

    requiredContinuousDCInputCurrentA:
      value.requiredContinuousDCInputCurrentA,

    requiredSurgeDCInputCurrentA:
      value.requiredSurgeDCInputCurrentA,
  };

  if (input.powerFactor !== undefined) {
    calculations.powerFactor =
      input.powerFactor;
  }

  if (input.inverterRatedPowerW !== undefined) {
    calculations.inverterRatedPowerW =
      input.inverterRatedPowerW;
  }

  if (input.inverterSurgePowerW !== undefined) {
    calculations.inverterSurgePowerW =
      input.inverterSurgePowerW;
  }

  if (input.inverterInputVoltageMinV !== undefined) {
    calculations.inverterInputVoltageMinV =
      input.inverterInputVoltageMinV;
  }

  if (input.inverterInputVoltageMaxV !== undefined) {
    calculations.inverterInputVoltageMaxV =
      input.inverterInputVoltageMaxV;
  }

  if (input.requiredOutputVoltageV !== undefined) {
    calculations.requiredOutputVoltageV =
      input.requiredOutputVoltageV;
  }

  if (input.inverterOutputVoltageV !== undefined) {
    calculations.inverterOutputVoltageV =
      input.inverterOutputVoltageV;
  }

  if (value.requiredContinuousVA !== undefined) {
    calculations.requiredContinuousVA =
      value.requiredContinuousVA;
  }

  if (value.continuousMarginW !== undefined) {
    calculations.continuousMarginW =
      value.continuousMarginW;
  }

  if (value.surgeMarginW !== undefined) {
    calculations.surgeMarginW =
      value.surgeMarginW;
  }

  if (value.continuousCompatible !== undefined) {
    calculations.continuousCompatible =
      value.continuousCompatible;
  }

  if (value.surgeCompatible !== undefined) {
    calculations.surgeCompatible =
      value.surgeCompatible;
  }

  if (value.inputVoltageCompatible !== undefined) {
    calculations.inputVoltageCompatible =
      value.inputVoltageCompatible;
  }

  if (value.outputVoltageCompatible !== undefined) {
    calculations.outputVoltageCompatible =
      value.outputVoltageCompatible;
  }

  if (value.systemCompatible !== undefined) {
    calculations.systemCompatible =
      value.systemCompatible;
  }

  const trace: InverterSizingTrace = {
    formulas: {
      requiredContinuousOutputPowerW:
        "requiredContinuousOutputPowerW = continuousLoadW",

      requiredSurgeOutputPowerW:
        "requiredSurgeOutputPowerW = surgeLoadW",

      requiredContinuousInputPowerW:
        "requiredContinuousInputPowerW = continuousLoadW / inverterEfficiency",

      requiredSurgeInputPowerW:
        "requiredSurgeInputPowerW = surgeLoadW / inverterEfficiency",

      requiredContinuousVA:
        "requiredContinuousVA = continuousLoadW / powerFactor",

      requiredContinuousDCInputCurrentA:
        "requiredContinuousDCInputCurrentA = requiredContinuousInputPowerW / systemVoltageV",

      requiredSurgeDCInputCurrentA:
        "requiredSurgeDCInputCurrentA = requiredSurgeInputPowerW / systemVoltageV",

      continuousMarginW:
        "continuousMarginW = inverterRatedPowerW - requiredContinuousOutputPowerW",

      surgeMarginW:
        "surgeMarginW = inverterSurgePowerW - requiredSurgeOutputPowerW",

      continuousCompatible:
        "continuousCompatible = inverterRatedPowerW >= requiredContinuousOutputPowerW",

      surgeCompatible:
        "surgeCompatible = inverterSurgePowerW >= requiredSurgeOutputPowerW",

      inputVoltageCompatible:
        "inputVoltageCompatible = systemVoltageV >= inverterInputVoltageMinV AND systemVoltageV <= inverterInputVoltageMaxV",

      outputVoltageCompatible:
        "outputVoltageCompatible = requiredOutputVoltageV === inverterOutputVoltageV",

      systemCompatible:
        "systemCompatible = every supplied compatibility check is true",
    },

    assumptions: [
      "Continuous and surge load values represent AC load-side power.",
      "Inverter efficiency is represented as a decimal between 0 and 1.",
      "Inverter rated power is compared against AC output load power.",
      "Inverter efficiency is used to estimate DC input power.",
      "DC input current is estimated from DC input power divided by system voltage.",
      "Power factor is only used to calculate apparent continuous power when supplied.",
      "Input voltage compatibility is evaluated only when both minimum and maximum inverter input voltages are supplied.",
      "Output voltage compatibility is evaluated only when both required and inverter output voltages are supplied.",
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

export { calculateInverterSizing };

export type {
  InverterSizingInput,
  InverterSizingResult,
  InverterSizingValue,
};