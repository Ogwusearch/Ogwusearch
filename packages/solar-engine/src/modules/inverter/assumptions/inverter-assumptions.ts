import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

import type {
  InverterSizingInput,
} from "../types/index.js";

/**
 * Returns the legacy human-readable assumptions.
 *
 * Kept for compatibility with existing domain consumers/tests.
 */
export function getInverterSizingAssumptions(
  input: InverterSizingInput,
): string[] {
  const assumptions: string[] = [
    "Continuous AC output requirement is based on the continuous connected load.",
    "Surge AC output requirement is based on the expected startup or transient load.",
    "Inverter efficiency is represented as a decimal fraction.",
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

  return assumptions;
}

/**
 * Returns structured assumptions for engineering-core.
 */
export function createInverterSizingAssumptions(
  input: InverterSizingInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [
    {
      code: "INVERTER_CONTINUOUS_LOAD_BASIS",
      name: "Continuous AC load basis",
      value: "continuousLoadW",
      unit: "W",
      description:
        "Continuous AC output requirement is based on the continuous connected load.",
      source: "Inverter sizing module",
    },
    {
      code: "INVERTER_SURGE_LOAD_BASIS",
      name: "Surge AC load basis",
      value: "surgeLoadW",
      unit: "W",
      description:
        "Surge AC output requirement is based on the expected startup or transient load.",
      source: "Inverter sizing module",
    },
    {
      code: "INVERTER_EFFICIENCY_BASIS",
      name: "Inverter efficiency representation",
      value: input.inverterEfficiency,
      unit: "fraction",
      description:
        "Inverter efficiency is represented as a decimal fraction.",
      source: "User input",
    },
    {
      code: "INVERTER_DC_POWER_BASIS",
      name: "DC input power basis",
      value: "AC power / inverterEfficiency",
      unit: "W",
      description:
        "DC input power accounts for inverter efficiency.",
      source: "Inverter sizing module",
    },
    {
      code: "INVERTER_DC_CURRENT_BASIS",
      name: "DC input current basis",
      value: "DC input power / system voltage",
      unit: "A",
      description:
        "DC input current is calculated from DC input power and system voltage.",
      source: "Inverter sizing module",
    },
  ];

  if (input.powerFactor !== undefined) {
    assumptions.push({
      code: "INVERTER_POWER_FACTOR_BASIS",
      name: "Continuous apparent power basis",
      value: input.powerFactor,
      unit: "fraction",
      description:
        "Continuous apparent power is calculated from continuous load and the supplied power factor.",
      source: "User input",
    });
  }

  if (input.inverterRatedPowerW !== undefined) {
    assumptions.push({
      code: "INVERTER_CONTINUOUS_RATING_BASIS",
      name: "Continuous inverter rating",
      value: input.inverterRatedPowerW,
      unit: "W",
      description:
        "Continuous inverter compatibility is evaluated against the supplied inverter continuous rating.",
      source: "Equipment specification",
    });
  }

  if (input.inverterSurgePowerW !== undefined) {
    assumptions.push({
      code: "INVERTER_SURGE_RATING_BASIS",
      name: "Inverter surge rating",
      value: input.inverterSurgePowerW,
      unit: "W",
      description:
        "Surge inverter compatibility is evaluated against the supplied inverter surge rating.",
      source: "Equipment specification",
    });
  }

  if (
    input.inverterInputVoltageMinV !== undefined &&
    input.inverterInputVoltageMaxV !== undefined
  ) {
    assumptions.push({
      code: "INVERTER_INPUT_VOLTAGE_RANGE",
      name: "Inverter DC input voltage range",
      value: {
        minV: input.inverterInputVoltageMinV,
        maxV: input.inverterInputVoltageMaxV,
      },
      unit: "V",
      description:
        "DC input voltage compatibility is evaluated against the supplied inverter input voltage range.",
      source: "Equipment specification",
    });
  }

  if (
    input.requiredOutputVoltageV !== undefined &&
    input.inverterOutputVoltageV !== undefined
  ) {
    assumptions.push({
      code: "INVERTER_OUTPUT_VOLTAGE_MATCH",
      name: "AC output voltage compatibility",
      value: {
        requiredV: input.requiredOutputVoltageV,
        inverterV: input.inverterOutputVoltageV,
      },
      unit: "V",
      description:
        "AC output voltage compatibility is evaluated by comparing the required and inverter output voltages.",
      source: "System and equipment specification",
    });
  }

  return assumptions;
}