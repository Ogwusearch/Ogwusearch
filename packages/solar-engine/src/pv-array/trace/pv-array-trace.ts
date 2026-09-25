import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export function createPvArrayTrace(): CalculationTraceStep[] {
  return [
    {
      id: "pv-array-input",
      name: "PV Array Input",
      description:
        "PV module and array configuration accepted.",
      sequence: 1,
    },
    {
      id: "pv-array-voltage",
      name: "PV Array Voltage",
      description:
        "Array operating and open-circuit voltages calculated.",
      sequence: 2,
    },
    {
      id: "pv-array-current",
      name: "PV Array Current",
      description:
        "Array operating and short-circuit currents calculated.",
      sequence: 3,
    },
    {
      id: "pv-array-power",
      name: "PV Array Power",
      description:
        "Total PV array power calculated.",
      sequence: 4,
    },
  ];
}