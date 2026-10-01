import type { CalculationTraceStep } from "@ogwusearch/engineering-types";

import type {
  ProtectionInput,
  ProtectionOutput,
} from "../types/index.js";

export function createProtectionTrace(
  input: ProtectionInput,
  output: ProtectionOutput,
): CalculationTraceStep[] {
  const steps: CalculationTraceStep[] = [
    {
      id: "protection-operating-current",
      name: "Operating Current",
      description: "Use the supplied operating current.",
      formula:
        "operatingCurrent = supplied operating current",
      inputs: {
        operatingCurrentA:
          input.electrical.operatingCurrentA,
      },
      outputs: {
        operatingCurrentA: output.operatingCurrentA,
      },
      unit: "A",
      sequence: 1,
    },

    {
      id: "protection-design-current",
      name: "Design Current",
      description:
        "Determine design current from a supplied design current, explicit factor, or design margin.",
      formula:
        input.electrical.designCurrentA !== undefined
          ? "designCurrent = supplied design current"
          : input.design?.explicitProtectionFactor !== undefined
            ? "designCurrent = operatingCurrent × explicitProtectionFactor"
            : "designCurrent = operatingCurrent × (1 + designMargin)",
      inputs: {
        operatingCurrentA: output.operatingCurrentA,
        designCurrentA:
          input.electrical.designCurrentA,
        explicitProtectionFactor:
          input.design?.explicitProtectionFactor,
        designMargin: input.design?.designMargin,
      },
      outputs: {
        designCurrentA: output.designCurrentA,
      },
      unit: "A",
      sequence: 2,
    },

    {
      id: "protection-required-rating",
      name: "Required Protective Rating",
      description:
        "Set the required protective current rating equal to the calculated design current.",
      formula:
        "requiredProtectiveCurrent = designCurrent",
      inputs: {
        designCurrentA: output.designCurrentA,
      },
      outputs: {
        requiredProtectiveCurrentA:
          output.requiredProtectiveCurrentA,
      },
      unit: "A",
      sequence: 3,
    },

    {
      id: "protection-compatibility",
      name: "Device Compatibility",
      description:
        "Evaluate current, voltage, and interrupting-capacity compatibility where device ratings are supplied.",
      inputs: {
        selectedProtectiveCurrentA:
          output.selectedProtectiveCurrentA,
        selectedDeviceVoltageRatingV:
          output.selectedDeviceVoltageRatingV,
        selectedDeviceInterruptingRatingA:
          output.selectedDeviceInterruptingRatingA,
      },
      outputs: {
        ...output.compatibility,
      },
      sequence: 4,
    },
  ];

  return steps;
}