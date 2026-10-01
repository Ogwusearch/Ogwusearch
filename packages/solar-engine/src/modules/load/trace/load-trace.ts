
// ============================================================
// Solar Engine
// Load Audit Trace
// ============================================================

import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export function createLoadTrace(): CalculationTraceStep[] {
  return [
    {
      id: "load-input",
      name: "Load Input",
      description:
        "Load audit input accepted.",
      sequence: 1,
    },
    {
      id: "load-calculation",
      name: "Load Calculation",
      description:
        "Connected, running, and demand loads calculated.",
      sequence: 2,
    },
    {
      id: "energy-calculation",
      name: "Energy Calculation",
      description:
        "Daily and monthly energy consumption calculated.",
      sequence: 3,
    },
    {
      id: "peak-demand",
      name: "Peak Demand",
      description:
        "Peak demand calculated.",
      sequence: 4,
    },
  ];
}
