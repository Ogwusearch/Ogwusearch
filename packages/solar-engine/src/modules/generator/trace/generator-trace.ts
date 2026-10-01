import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  GeneratorInput,
  GeneratorOutput,
} from "../types/index.js";

/**
 * Create Generator calculation trace steps.
 *
 * The trace records the engineering decisions actually used by
 * the calculation. It does not expose invented intermediate
 * calculations.
 */
export function createGeneratorTrace(
  input: GeneratorInput,
  output: GeneratorOutput,
): CalculationTraceStep[] {
  const steps: CalculationTraceStep[] = [];

  steps.push({
    id: "generator-required-power",
    name: "Generator Required Power",
    description:
      "Use the upstream engineering real-power requirement.",
    formula: "P_required = upstream requirement",
    inputs: {
      requiredPowerW:
        input.requirement.requiredPowerW,
    },
    outputs: {
      requiredPowerW:
        output.capacity.requiredPowerW,
    },
    unit: "W",
    sequence: 1,
  });

  const suppliedApparentPower =
    input.requirement.requiredApparentPowerVA;

  if (suppliedApparentPower !== undefined) {
    steps.push({
      id: "generator-apparent-power",
      name: "Generator Apparent Power",
      description:
        "Use the upstream apparent-power requirement without recalculation.",
      formula:
        "S_required = supplied upstream apparent power",
      inputs: {
        requiredApparentPowerVA:
          suppliedApparentPower,
      },
      outputs: {
        requiredApparentPowerVA:
          output.capacity.requiredApparentPowerVA,
      },
      unit: "VA",
      sequence: 2,
    });
  } else {
    const powerFactor =
      output.capacity.powerFactor ?? 1;

    steps.push({
      id: "generator-apparent-power",
      name: "Generator Apparent Power",
      description:
        "Derive apparent power from real power and explicit/default power factor.",
      formula: "S = P / PF",
      inputs: {
        requiredPowerW:
          input.requirement.requiredPowerW,
        powerFactor,
      },
      outputs: {
        requiredApparentPowerVA:
          output.capacity.requiredApparentPowerVA,
      },
      unit: "VA",
      sequence: 2,
    });
  }

  if (
    output.capacity.designMargin !== undefined
  ) {
    steps.push({
      id: "generator-design-margin",
      name: "Generator Design Margin",
      description:
        "Apply the explicitly supplied generator-specific design margin.",
      formula:
        "S_design = S × (1 + designMargin)",
      inputs: {
        apparentPowerVA:
          input.requirement.requiredApparentPowerVA ??
          output.capacity.requiredApparentPowerVA,
        designMargin:
          output.capacity.designMargin,
      },
      outputs: {
        requiredApparentPowerVA:
          output.capacity.requiredApparentPowerVA,
      },
      unit: "VA",
      sequence: 3,
    });
  }

  if (output.capacityMargin !== undefined) {
    steps.push({
      id: "generator-capacity-margin",
      name: "Generator Capacity Margin",
      description:
        "Compare the supplied generator rating with the required capacity.",
      formula:
        "margin = generator capacity - required capacity",
      inputs: {
        generatorCapacityVA:
          output.capacityMargin.generatorCapacityVA,
        requiredCapacityVA:
          output.capacityMargin.requiredCapacityVA,
      },
      outputs: {
        marginVA:
          output.capacityMargin.marginVA,
        marginFraction:
          output.capacityMargin.marginFraction,
        utilization:
          output.capacityMargin.utilization,
      },
      unit: "VA",
      sequence: output.capacity.designMargin !== undefined
        ? 4
        : 3,
    });
  }

  if (output.compatibility !== undefined) {
    steps.push({
      id: "generator-compatibility",
      name: "Generator Compatibility",
      description:
        "Evaluate explicitly supplied generator ratings against explicit requirements.",
      inputs: {
        requiredVoltageV:
          input.electrical?.requiredVoltageV,
        generatorVoltageV:
          input.generator?.voltageV,
        requiredFrequencyHz:
          input.electrical?.requiredFrequencyHz,
        generatorFrequencyHz:
          input.generator?.frequencyHz,
        requiredPhase:
          input.electrical?.requiredPhase,
        generatorPhase:
          input.generator?.phase,
      },
      outputs: {
        ...output.compatibility,
      },
      sequence:
        output.capacity.designMargin !== undefined
          ? 5
          : output.capacityMargin !== undefined
            ? 4
            : 3,
    });
  }

  return steps;
}