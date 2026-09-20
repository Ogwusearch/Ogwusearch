import type {
  CalculationTrace
} from "@ogwusearch/engineering-types";

import type { LoadAuditInput } from "./input";
import type { LoadAuditResult } from "./result";

export function buildLoadAuditTrace(
  input: LoadAuditInput,
  result: LoadAuditResult
): CalculationTrace {
  return {
    formulas: [
      {
        id: "load-total-power",
        name: "Load Item Power",
        expression:
          "quantity × ratedPowerW",
        result:
          "Calculated for each load item.",
        unit: "W"
      },
      {
        id: "daily-energy",
        name: "Daily Energy",
        expression:
          "totalPowerW × hoursPerDay",
        result:
          result.totalDailyEnergyWh,
        unit: "Wh/day"
      },
      {
        id: "weekly-energy",
        name: "Weekly Energy",
        expression:
          "dailyEnergyWh × daysPerWeek",
        result:
          result.totalWeeklyEnergyWh,
        unit: "Wh/week"
      },
      {
        id: "diversified-load",
        name: "Diversified Load",
        expression:
          "totalConnectedLoadW × diversityFactor",
        result:
          result.diversifiedLoadW,
        unit: "W"
      },
      {
        id: "design-load",
        name: "Design Load",
        expression:
          "diversifiedLoadW × (1 + designMargin)",
        result:
          result.designLoadW,
        unit: "W"
      }
    ],

    assumptions: [],

    intermediateValues: [
      {
        name: "Total Connected Load",
        value:
          result.totalConnectedLoadW,
        unit: "W",
        description:
          "Sum of the rated power of all load items."
      },
      {
        name: "Diversified Load",
        value:
          result.diversifiedLoadW,
        unit: "W",
        description:
          "Connected load after application of diversity factor."
      },
      {
        name: "Design Load",
        value:
          result.designLoadW,
        unit: "W",
        description:
          "Diversified load after application of design margin."
      },
      {
        name: "Daily Energy",
        value:
          result.totalDailyEnergyWh,
        unit: "Wh/day",
        description:
          "Total calculated daily energy consumption."
      }
    ],

    constants: [
      {
        name: "Wh per kWh",
        value: 1000,
        unit: "Wh/kWh",
        source: "Unit conversion"
      }
    ],

    steps: [
      {
        order: 1,
        description:
          "Calculate the total power for every load item."
      },
      {
        order: 2,
        description:
          "Calculate daily energy for every load item."
      },
      {
        order: 3,
        description:
          "Calculate weekly energy for every load item."
      },
      {
        order: 4,
        description:
          "Aggregate connected load and energy."
      },
      {
        order: 5,
        description:
          "Apply diversity factor."
      },
      {
        order: 6,
        description:
          "Apply design margin."
      }
    ]
  };
}