import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  CableInput,
  CableOutput,
} from "../types/index.js";

export function createCableTrace(
  input: CableInput,
  output: CableOutput,
): CalculationTraceStep[] {
  const currentFormula =
    input.operatingCurrentA !==
    undefined
      ? "I = supplied operating current"
      : input.mode === "DC"
        ? "I = P / V"
        : "I = P / (V × PF)";

  return [
    {
      id: "cable-operating-current",
      name: "Operating Current",
      description:
        "Determine the cable operating current from the explicit input current or the applicable electrical relationship.",
      formula: currentFormula,
      inputs: {
        mode: input.mode,
        ...(input.loadPowerW !==
          undefined && {
          loadPowerW:
            input.loadPowerW,
        }),
        ...(input.systemVoltageV !==
          undefined && {
          systemVoltageV:
            input.systemVoltageV,
        }),
        ...(input.powerFactor !==
          undefined && {
          powerFactor:
            input.powerFactor,
        }),
        ...(input.operatingCurrentA !==
          undefined && {
          operatingCurrentA:
            input.operatingCurrentA,
        }),
      },
      outputs: {
        operatingCurrentA:
          output.operatingCurrentA,
      },
      unit: "A",
      sequence: 1,
    },

    {
      id: "cable-design-current",
      name: "Design Current",
      description:
        "Apply the explicit cable design margin to the operating current.",
      formula:
        "Idesign = Ioperating × (1 + margin)",
      inputs: {
        operatingCurrentA:
          output.operatingCurrentA,
        designMargin:
          input.designMargin,
      },
      outputs: {
        designCurrentA:
          output.designCurrentA,
      },
      unit: "A",
      sequence: 2,
    },

    {
      id: "cable-required-ampacity",
      name: "Required Ampacity",
      description:
        "Determine the minimum conductor ampacity required by the cable sizing calculation.",
      formula:
        "Required Ampacity = Design Current",
      inputs: {
        designCurrentA:
          output.designCurrentA,
      },
      outputs: {
        requiredAmpacityA:
          output.requiredAmpacityA,
      },
      unit: "A",
      sequence: 3,
    },

    {
      id: "cable-selected-size",
      name: "Selected Cable Size",
      description:
        "Select the smallest explicit conductor option whose allowable ampacity satisfies the required ampacity.",
      inputs: {
        requiredAmpacityA:
          output.requiredAmpacityA,
        conductorOptions:
          input.conductorOptions,
        conductorMaterial:
          input.conductorMaterial,
      },
      outputs: {
        selectedConductorAreaMm2:
          output.selectedConductorAreaMm2,
        selectedConductorAmpacityA:
          output.selectedConductorAmpacityA,
      },
      unit: "mm²",
      sequence: 4,
    },
  ];
}