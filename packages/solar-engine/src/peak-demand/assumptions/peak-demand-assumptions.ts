import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

export function createPeakDemandAssumptions(
  diversityFactor: number,
  demandMargin: number,
): EngineeringAssumption[] {
  return [
    {
      code: "PEAK_DIVERSITY_FACTOR",
      name: "Peak Diversity Factor",
      value: diversityFactor,
      unit: "ratio",
      description:
        "System-level diversity factor used to calculate coincident demand.",
      source: "Design input/default",
    },
    {
      code: "PEAK_DEMAND_MARGIN",
      name: "Peak Demand Design Margin",
      value: demandMargin,
      unit: "ratio",
      description:
        "Additional capacity applied to calculated peak demand.",
      source: "Design input/default",
    },
  ];
}
