import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

import type {
  VoltageDropInput,
} from "../types/index.js";

export function createVoltageDropAssumptions(
  input: VoltageDropInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [
    {
      code: "VOLTAGE_DROP_MODE",
      name: "Voltage-drop calculation mode",
      value: input.mode,
      description:
        "Electrical mode explicitly supplied by the caller.",
      source: "User input",
    },
    {
      code: "VOLTAGE_DROP_CURRENT",
      name: "Operating current",
      value: input.operatingCurrentA,
      unit: "A",
      description:
        "Operating current used for the voltage-drop calculation.",
      source: "User input",
    },
  ];

  if (
    input.resistanceOhm !==
    undefined
  ) {
    assumptions.push({
      code: "VOLTAGE_DROP_RESISTANCE",
      name: "Circuit resistance",
      value: input.resistanceOhm,
      unit: "Ω",
      description:
        "Explicit circuit resistance supplied by the caller.",
      source: "User input",
    });
  } else {
    assumptions.push(
      {
        code: "VOLTAGE_DROP_RESISTIVITY",
        name: "Conductor resistivity",
        value:
          input.resistivityOhmMm2PerM,
        unit: "Ω·mm²/m",
        description:
          "Conductor resistivity used to derive circuit resistance.",
        source: "User input",
      },
      {
        code: "VOLTAGE_DROP_PATH_LENGTH",
        name: "Electrical path length",
        value:
          input.conductorLengthM,
        unit: "m",
        description:
          "Total electrical path length represented by the resistance model.",
        source: "User input",
      },
      {
        code: "VOLTAGE_DROP_CONDUCTOR_AREA",
        name: "Conductor cross-sectional area",
        value:
          input.conductorAreaMm2,
        unit: "mm²",
        description:
          "Conductor cross-sectional area used to derive resistance.",
        source: "User input",
      },
    );
  }

  if (
    input.allowableVoltageDropPercent !==
    undefined
  ) {
    assumptions.push({
      code: "VOLTAGE_DROP_ALLOWABLE_LIMIT",
      name: "Allowable voltage drop",
      value:
        input.allowableVoltageDropPercent,
      unit: "%",
      description:
        "Explicit voltage-drop evaluation threshold.",
      source: "User input",
    });
  }

  return assumptions;
}