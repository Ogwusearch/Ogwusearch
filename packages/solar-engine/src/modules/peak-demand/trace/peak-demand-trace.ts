import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export function createPeakDemandTrace():
  CalculationTraceStep[] {
  return [
    {
      id: "peak-demand-input",
      name: "Peak Demand Input",
      description:
        "Peak demand input accepted.",
      sequence: 1,
    },
    {
      id: "continuous-demand",
      name: "Continuous Demand",
      description:
        "Individual demand calculated using demand factors.",
      sequence: 2,
    },
    {
      id: "diversity-adjustment",
      name: "Diversity Adjustment",
      description:
        "Individual demands aggregated into coincident system demand.",
      sequence: 3,
    },
    {
      id: "starting-demand",
      name: "Starting Demand",
      description:
        "Starting or surge demand calculated for applicable loads.",
      sequence: 4,
    },
    {
      id: "peak-demand",
      name: "Peak Demand",
      description:
        "Relevant operating scenarios evaluated.",
      sequence: 5,
    },
    {
      id: "design-demand",
      name: "Design Demand",
      description:
        "Design margin applied to calculated peak demand.",
      sequence: 6,
    },
  ];
}
