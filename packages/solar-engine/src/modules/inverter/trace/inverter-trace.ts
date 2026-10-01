import type {
  CalculationTrace,
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  InverterSizingInput,
  InverterSizingValue,
} from "../types/index.js";

import {
  createInverterSizingTrace,
} from "./inverter-sizing-trace.js";

/**
 * Creates the high-level inverter sizing trace.
 *
 * Kept for compatibility with existing inverter consumers.
 */
export function createInverterTrace(): CalculationTrace {
  return {
    steps: [
      {
        id: "validate-inverter-input",
        name: "Validate inverter sizing input",
      },
      {
        id: "calculate-continuous-rating",
        name: "Calculate required continuous inverter rating",
      },
      {
        id: "calculate-surge-rating",
        name: "Calculate required inverter surge rating",
      },
      {
        id: "calculate-continuous-apparent-power",
        name: "Calculate continuous apparent power",
      },
      {
        id: "calculate-continuous-input-power",
        name: "Calculate continuous DC input power",
      },
      {
        id: "calculate-surge-input-power",
        name: "Calculate surge DC input power",
      },
      {
        id: "calculate-continuous-input-current",
        name: "Calculate continuous DC input current",
      },
      {
        id: "calculate-surge-input-current",
        name: "Calculate surge DC input current",
      },
      {
        id: "evaluate-capacity-compatibility",
        name: "Evaluate inverter capacity compatibility",
      },
      {
        id: "evaluate-voltage-compatibility",
        name: "Evaluate inverter voltage compatibility",
      },
      {
        id: "evaluate-system-compatibility",
        name: "Evaluate overall inverter compatibility",
      },
    ],
  };
}

/**
 * Adapts the existing domain trace to the engineering-core
 * execution trace.
 *
 * No inverter calculation is performed here.
 */
export function appendInverterSizingTrace(
  trace: {
    add(step: CalculationTraceStep): void;
  },
  input: InverterSizingInput,
  value: InverterSizingValue,
): void {
  const domainTrace =
    createInverterSizingTrace(
      input,
      value,
    );

  trace.add({
    id: "calculate-continuous-output-power",
    name:
      "Calculate required continuous AC output power",
    formula:
      domainTrace.formulas
        .requiredContinuousOutputPowerW,
    inputs: {
      continuousLoadW:
        input.continuousLoadW,
    },
    outputs: {
      requiredContinuousOutputPowerW:
        value.requiredContinuousOutputPowerW,
    },
    unit: "W",
  });

  trace.add({
    id: "calculate-surge-output-power",
    name:
      "Calculate required surge AC output power",
    formula:
      domainTrace.formulas
        .requiredSurgeOutputPowerW,
    inputs: {
      surgeLoadW:
        input.surgeLoadW,
    },
    outputs: {
      requiredSurgeOutputPowerW:
        value.requiredSurgeOutputPowerW,
    },
    unit: "W",
  });

  if (
    value.requiredContinuousVA !==
    undefined
  ) {
    trace.add({
      id: "calculate-continuous-apparent-power",
      name:
        "Calculate continuous apparent power",
      formula:
        domainTrace.formulas
          .requiredContinuousVA,
      inputs: {
        continuousLoadW:
          input.continuousLoadW,
        powerFactor:
          input.powerFactor,
      },
      outputs: {
        requiredContinuousVA:
          value.requiredContinuousVA,
      },
      unit: "VA",
    });
  }

  trace.add({
    id: "calculate-continuous-input-power",
    name:
      "Calculate required continuous DC input power",
    formula:
      domainTrace.formulas
        .requiredContinuousInputPowerW,
    inputs: {
      continuousLoadW:
        input.continuousLoadW,
      inverterEfficiency:
        input.inverterEfficiency,
    },
    outputs: {
      requiredContinuousInputPowerW:
        value.requiredContinuousInputPowerW,
    },
    unit: "W",
  });

  trace.add({
    id: "calculate-surge-input-power",
    name:
      "Calculate required surge DC input power",
    formula:
      domainTrace.formulas
        .requiredSurgeInputPowerW,
    inputs: {
      surgeLoadW:
        input.surgeLoadW,
      inverterEfficiency:
        input.inverterEfficiency,
    },
    outputs: {
      requiredSurgeInputPowerW:
        value.requiredSurgeInputPowerW,
    },
    unit: "W",
  });

  trace.add({
    id: "calculate-continuous-input-current",
    name:
      "Calculate required continuous DC input current",
    formula:
      domainTrace.formulas
        .requiredContinuousDCInputCurrentA,
    inputs: {
      requiredContinuousInputPowerW:
        value.requiredContinuousInputPowerW,
      systemVoltageV:
        input.systemVoltageV,
    },
    outputs: {
      requiredContinuousDCInputCurrentA:
        value.requiredContinuousDCInputCurrentA,
    },
    unit: "A",
  });

  trace.add({
    id: "calculate-surge-input-current",
    name:
      "Calculate required surge DC input current",
    formula:
      domainTrace.formulas
        .requiredSurgeDCInputCurrentA,
    inputs: {
      requiredSurgeInputPowerW:
        value.requiredSurgeInputPowerW,
      systemVoltageV:
        input.systemVoltageV,
    },
    outputs: {
      requiredSurgeDCInputCurrentA:
        value.requiredSurgeDCInputCurrentA,
    },
    unit: "A",
  });

  if (
    value.continuousCompatible !==
      undefined ||
    value.surgeCompatible !==
      undefined
  ) {
    trace.add({
      id: "evaluate-inverter-capacity",
      name:
        "Evaluate inverter capacity compatibility",
      inputs: {
        inverterRatedPowerW:
          input.inverterRatedPowerW,
        inverterSurgePowerW:
          input.inverterSurgePowerW,
      },
      outputs: {
        continuousMarginW:
          value.continuousMarginW,
        continuousCompatible:
          value.continuousCompatible,
        surgeMarginW:
          value.surgeMarginW,
        surgeCompatible:
          value.surgeCompatible,
      },
    });
  }

  if (
    value.inputVoltageCompatible !==
    undefined
  ) {
    trace.add({
      id:
        "evaluate-input-voltage-compatibility",
      name:
        "Evaluate inverter DC input voltage compatibility",
      formula:
        domainTrace.formulas
          .inputVoltageCompatible,
      inputs: {
        systemVoltageV:
          input.systemVoltageV,
        inverterInputVoltageMinV:
          input.inverterInputVoltageMinV,
        inverterInputVoltageMaxV:
          input.inverterInputVoltageMaxV,
      },
      outputs: {
        inputVoltageCompatible:
          value.inputVoltageCompatible,
      },
    });
  }

  if (
    value.outputVoltageCompatible !==
    undefined
  ) {
    trace.add({
      id:
        "evaluate-output-voltage-compatibility",
      name:
        "Evaluate inverter AC output voltage compatibility",
      formula:
        domainTrace.formulas
          .outputVoltageCompatible,
      inputs: {
        requiredOutputVoltageV:
          input.requiredOutputVoltageV,
        inverterOutputVoltageV:
          input.inverterOutputVoltageV,
      },
      outputs: {
        outputVoltageCompatible:
          value.outputVoltageCompatible,
      },
    });
  }

  if (
    value.systemCompatible !==
    undefined
  ) {
    trace.add({
      id:
        "evaluate-system-compatibility",
      name:
        "Evaluate overall inverter system compatibility",
      formula:
        domainTrace.formulas
          .systemCompatible,
      outputs: {
        systemCompatible:
          value.systemCompatible,
      },
    });
  }
}