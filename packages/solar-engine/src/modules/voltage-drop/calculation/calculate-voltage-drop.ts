import type {
  VoltageDropInput,
  VoltageDropOutput,
} from "../types/index.js";

function calculateResistance(
  input: VoltageDropInput,
): number {
  if (
    input.resistanceOhm !==
    undefined
  ) {
    return input.resistanceOhm;
  }

  if (
    input.conductorLengthM ===
      undefined ||
    input.conductorAreaMm2 ===
      undefined ||
    input.resistivityOhmMm2PerM ===
      undefined
  ) {
    throw new Error(
      "A complete conductor resistance model is required when resistanceOhm is not supplied.",
    );
  }

  return (
    input.resistivityOhmMm2PerM *
    input.conductorLengthM
  ) /
    input.conductorAreaMm2;
}

export function calculateVoltageDrop(
  input: VoltageDropInput,
): VoltageDropOutput {
  const resistanceOhm =
    calculateResistance(input);

  const voltageDropV =
    input.operatingCurrentA *
    resistanceOhm;

  const loadVoltageV =
    input.sourceVoltageV -
    voltageDropV;

  const voltageDropPercent =
    (
      voltageDropV /
      input.sourceVoltageV
    ) *
    100;

  const withinAllowableLimit =
    input.allowableVoltageDropPercent !==
    undefined
      ? voltageDropPercent <=
        input.allowableVoltageDropPercent
      : undefined;

  return {
    mode: input.mode,

    sourceVoltageV:
      input.sourceVoltageV,

    operatingCurrentA:
      input.operatingCurrentA,

    resistanceOhm,

    voltageDropV,

    voltageDropPercent,

    loadVoltageV,

    ...(input.allowableVoltageDropPercent !==
      undefined && {
      allowableVoltageDropPercent:
        input.allowableVoltageDropPercent,
    }),

    ...(withinAllowableLimit !==
      undefined && {
      withinAllowableLimit,
    }),
  };
}