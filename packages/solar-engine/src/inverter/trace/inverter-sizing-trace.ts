import type {
  InverterSizingInput,
  InverterSizingValue,
} from "../types";

export interface InverterSizingTrace {
  formulas: {
    requiredContinuousOutputPowerW: string;
    requiredSurgeOutputPowerW: string;
    requiredContinuousInputPowerW: string;
    requiredSurgeInputPowerW: string;
    requiredContinuousVA: string;
    requiredContinuousDCInputCurrentA: string;
    requiredSurgeDCInputCurrentA: string;
    continuousMarginW: string;
    surgeMarginW: string;
    continuousCompatible: string;
    surgeCompatible: string;
    inputVoltageCompatible: string;
    outputVoltageCompatible: string;
    systemCompatible: string;
  };

  assumptions: string[];

  calculations: {
    continuousLoadW: number;
    surgeLoadW: number;
    systemVoltageV: number;
    inverterEfficiency: number;

    powerFactor?: number;

    inverterRatedPowerW?: number;
    inverterSurgePowerW?: number;

    inverterInputVoltageMinV?: number;
    inverterInputVoltageMaxV?: number;

    requiredOutputVoltageV?: number;
    inverterOutputVoltageV?: number;

    requiredContinuousOutputPowerW: number;
    requiredSurgeOutputPowerW: number;

    requiredContinuousInputPowerW: number;
    requiredSurgeInputPowerW: number;

    requiredContinuousVA?: number;

    requiredContinuousDCInputCurrentA: number;
    requiredSurgeDCInputCurrentA: number;

    continuousMarginW?: number;
    surgeMarginW?: number;

    continuousCompatible?: boolean;
    surgeCompatible?: boolean;
    inputVoltageCompatible?: boolean;
    outputVoltageCompatible?: boolean;
    systemCompatible?: boolean;
  };
}

export function createInverterSizingTrace(
  input: InverterSizingInput,
  value: InverterSizingValue,
): InverterSizingTrace {
  const assumptions: string[] = [
    "Continuous AC output requirement is based on the continuous connected load.",
    "Surge AC output requirement is based on the expected startup or transient load.",
    "DC input power accounts for inverter efficiency.",
    "DC input current is calculated from DC input power and system voltage.",
  ];

  if (input.powerFactor !== undefined) {
    assumptions.push(
      "Continuous apparent power is calculated from continuous load and the supplied power factor.",
    );
  }

  if (input.inverterRatedPowerW !== undefined) {
    assumptions.push(
      "Continuous inverter compatibility is evaluated against the supplied inverter continuous rating.",
    );
  }

  if (input.inverterSurgePowerW !== undefined) {
    assumptions.push(
      "Surge inverter compatibility is evaluated against the supplied inverter surge rating.",
    );
  }

  if (
    input.inverterInputVoltageMinV !== undefined &&
    input.inverterInputVoltageMaxV !== undefined
  ) {
    assumptions.push(
      "DC input voltage compatibility is evaluated against the supplied inverter input voltage range.",
    );
  }

  if (
    input.requiredOutputVoltageV !== undefined &&
    input.inverterOutputVoltageV !== undefined
  ) {
    assumptions.push(
      "AC output voltage compatibility is evaluated by comparing the required and inverter output voltages.",
    );
  }

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

  if (
    input.inverterInputVoltageMinV !== undefined
  ) {
    calculations.inverterInputVoltageMinV =
      input.inverterInputVoltageMinV;
  }

  if (
    input.inverterInputVoltageMaxV !== undefined
  ) {
    calculations.inverterInputVoltageMaxV =
      input.inverterInputVoltageMaxV;
  }

  if (
    input.requiredOutputVoltageV !== undefined
  ) {
    calculations.requiredOutputVoltageV =
      input.requiredOutputVoltageV;
  }

  if (
    input.inverterOutputVoltageV !== undefined
  ) {
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

  return {
    formulas: {
      requiredContinuousOutputPowerW:
        "continuousLoadW",

      requiredSurgeOutputPowerW:
        "surgeLoadW",

      requiredContinuousInputPowerW:
        "continuousLoadW / inverterEfficiency",

      requiredSurgeInputPowerW:
        "surgeLoadW / inverterEfficiency",

      requiredContinuousVA:
        "continuousLoadW / powerFactor",

      requiredContinuousDCInputCurrentA:
        "requiredContinuousInputPowerW / systemVoltageV",

      requiredSurgeDCInputCurrentA:
        "requiredSurgeInputPowerW / systemVoltageV",

      continuousMarginW:
        "inverterRatedPowerW - requiredContinuousOutputPowerW",

      surgeMarginW:
        "inverterSurgePowerW - requiredSurgeOutputPowerW",

      continuousCompatible:
        "continuousMarginW >= 0",

      surgeCompatible:
        "surgeMarginW >= 0",

      inputVoltageCompatible:
        "systemVoltageV >= inverterInputVoltageMinV && systemVoltageV <= inverterInputVoltageMaxV",

      outputVoltageCompatible:
        "requiredOutputVoltageV === inverterOutputVoltageV",

      systemCompatible:
        "all supplied compatibility checks are true",
    },

    assumptions,
    calculations,
  };
}