// ============================================================
// Solar Engine
// Energy Analysis Trace
// ============================================================

import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export function createEnergyTrace(): CalculationTraceStep[] {
  return [
    {
      id: "energy-input",
      name: "Energy Input",
      description:
        "Energy analysis input accepted from the load analysis projection.",
      sequence: 1,
    },
    {
      id: "daily-energy",
      name: "Daily Energy",
      description:
        "Daily energy consumption calculated for each load.",
      sequence: 2,
    },
    {
      id: "monthly-energy",
      name: "Monthly Energy",
      description:
        "Monthly energy consumption calculated from daily energy and operating days.",
      sequence: 3,
    },
    {
      id: "annual-energy",
      name: "Annual Energy",
      description:
        "Annual energy consumption calculated from monthly energy.",
      sequence: 4,
    },
    {
      id: "system-loss-adjustment",
      name: "System Loss Adjustment",
      description:
        "Energy adjusted to account for the configured system loss factor.",
      sequence: 5,
    },
    {
      id: "energy-design-margin",
      name: "Energy Design Margin",
      description:
        "Additional energy design margin applied after system loss adjustment.",
      sequence: 6,
    },
    {
      id: "energy-output",
      name: "Energy Output",
      description:
        "Final daily, monthly, and annual energy results produced.",
      sequence: 7,
    },
  ];
}
