import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  VoltageDropInput,
  VoltageDropOutput,
} from "../types/index.js";

export function createVoltageDropTrace(
  input: VoltageDropInput,
  output: VoltageDropOutput,
): CalculationTraceStep[] {
  const steps: CalculationTraceStep[] = [];

  if (
    input.resistanceOhm ===
    undefined
  ) {
    steps.push({
      id: "VOLTAGE_DROP_RESISTANCE",
      name: "Calculate Circuit Resistance",
      description:
        "Derive circuit resistance from resistivity, electrical path length, and conductor area.",
      formula:
        "R = ρ × L / A",
      inputs: {
        resistivityOhmMm2PerM:
          input.resistivityOhmMm2PerM,
        conductorLengthM:
          input.conductorLengthM,
        conductorAreaMm2:
          input.conductorAreaMm2,
      },
      outputs: {
        resistanceOhm:
          output.resistanceOhm,
      },
      unit: "Ω",
      sequence: 1,
    });
  } else {
    steps.push({
      id: "VOLTAGE_DROP_RESISTANCE",
      name: "Use Circuit Resistance",
      description:
        "Use the explicit circuit resistance supplied by the caller.",
      formula:
        "R = supplied resistance",
      inputs: {
        resistanceOhm:
          input.resistanceOhm,
      },
      outputs: {
        resistanceOhm:
          output.resistanceOhm,
      },
      unit: "Ω",
      sequence: 1,
    });
  }

  steps.push({
    id: "VOLTAGE_DROP_CALCULATION",
    name: "Calculate Voltage Drop",
    description:
      "Calculate voltage lost across the circuit resistance.",
    formula:
      "Vdrop = I × R",
    inputs: {
      operatingCurrentA:
        input.operatingCurrentA,
      resistanceOhm:
        output.resistanceOhm,
    },
    outputs: {
      voltageDropV:
        output.voltageDropV,
    },
    unit: "V",
    sequence: 2,
  });

  steps.push({
    id: "VOLTAGE_DROP_LOAD_VOLTAGE",
    name: "Calculate Load Voltage",
    description:
      "Calculate voltage available at the load.",
    formula:
      "Vload = Vsource - Vdrop",
    inputs: {
      sourceVoltageV:
        input.sourceVoltageV,
      voltageDropV:
        output.voltageDropV,
    },
    outputs: {
      loadVoltageV:
        output.loadVoltageV,
    },
    unit: "V",
    sequence: 3,
  });

  steps.push({
    id: "VOLTAGE_DROP_PERCENTAGE",
    name: "Calculate Voltage Drop Percentage",
    description:
      "Express voltage drop as a percentage of source voltage.",
    formula:
      "Vdrop% = (Vdrop / Vsource) × 100",
    inputs: {
      voltageDropV:
        output.voltageDropV,
      sourceVoltageV:
        input.sourceVoltageV,
    },
    outputs: {
      voltageDropPercent:
        output.voltageDropPercent,
    },
    unit: "%",
    sequence: 4,
  });

  if (
    input.allowableVoltageDropPercent !==
    undefined
  ) {
    steps.push({
      id: "VOLTAGE_DROP_LIMIT_EVALUATION",
      name: "Evaluate Allowable Voltage Drop",
      description:
        "Compare calculated voltage drop percentage against the explicitly supplied allowable limit.",
      formula:
        "withinLimit = Vdrop% ≤ allowable%",
      inputs: {
        voltageDropPercent:
          output.voltageDropPercent,
        allowableVoltageDropPercent:
          input.allowableVoltageDropPercent,
      },
      outputs: {
        withinAllowableLimit:
          output.withinAllowableLimit,
      },
      sequence: 5,
    });
  }

  return steps;
}