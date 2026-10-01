import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  EarthingInput,
  EarthingOutput,
} from "../types/index.js";

export function createEarthingTrace(
  input: EarthingInput,
  output: EarthingOutput,
): CalculationTraceStep[] {
  const steps: CalculationTraceStep[] = [
    {
      id: "earthing-earth-conductor",
      name: "Earth Conductor",
      description:
        "Calculate the required earth-conductor area from fault current, clearing time, conductor constant, and design margin.",
      formula:
        "earthConductorArea = faultCurrent × √faultClearingTime / conductorConstant × (1 + designMargin)",
      inputs: {
        faultCurrentA:
          input.electrical.faultCurrentA,
        faultClearingTimeS:
          input.electrical.faultClearingTimeS,
        conductorConstantA_SqrtS_PerMm2:
          input.electrical
            .conductorConstantA_SqrtS_PerMm2,
        designMargin:
          input.design?.designMargin ?? 0,
      },
      outputs: {
        requiredEarthConductorAreaMm2:
          output.requiredEarthConductorAreaMm2,
      },
      unit: "mm²",
      sequence: 1,
    },

    {
      id: "earthing-bonding-conductor",
      name: "Bonding Conductor",
      description:
        "Calculate the required bonding-conductor area from the earth-conductor requirement and bonding factor.",
      formula:
        "bondingArea = earthConductorArea × bondingFactor",
      inputs: {
        earthConductorAreaMm2:
          output.requiredEarthConductorAreaMm2,
        bondingConductorFactor:
          input.design
            ?.bondingConductorFactor ?? 1,
      },
      outputs: {
        requiredBondingConductorAreaMm2:
          output.requiredBondingConductorAreaMm2,
      },
      unit: "mm²",
      sequence: 2,
    },

    {
      id: "earthing-resistance",
      name: "Earth Resistance",
      description:
        "Calculate earth resistance when soil resistivity and electrode geometry are supplied.",
      formula:
        "R = ρ / (2πL) × ln(4L / d)",
      inputs: {
        resistivityOhmM:
          input.electrical.resistivityOhmM,
        electrodeLengthM:
          input.electrical.electrodeLengthM,
        electrodeDiameterM:
          input.electrical.electrodeDiameterM,
      },
      outputs: {
        earthResistanceOhm:
          output.earthResistanceOhm,
      },
      unit: "Ω",
      sequence: 3,
    },

    {
      id: "earthing-compatibility",
      name: "Earthing Verification",
      description:
        "Compare calculated earth resistance with the supplied earth-resistance target when both are available.",
      inputs: {
        earthResistanceOhm:
          output.earthResistanceOhm,
        earthResistanceTargetOhm:
          output.earthResistanceTargetOhm,
      },
      outputs: {
        ...output.compatibility,
      },
      sequence: 4,
    },
  ];

  return steps;
}