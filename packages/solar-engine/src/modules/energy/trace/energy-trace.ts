
// ============================================================
// Solar Engine
// Energy Analysis Trace
// ============================================================

import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  EnergyInput,
  EnergyOutput,
} from "../types/index.js";

import { ENERGY_DEFAULTS } from "../constants.js";

export function createEnergyTrace(
  input: EnergyInput,
  output: EnergyOutput,
): CalculationTraceStep[] {
  const steps: CalculationTraceStep[] = [
    {
      id: "energy-daily-energy",
      name: "Daily Energy",
      description:
        "Calculate daily energy from running load and operating hours.",
      formula:
        "dailyEnergyWh = runningLoadW × operatingHoursPerDay",
      inputs: {
        loads: input.loads.map((load) => ({
          loadId: load.loadId,
          runningLoadW: load.runningLoadW,
          operatingHoursPerDay:
            load.operatingHoursPerDay,
        })),
      },
      outputs: {
        totalDailyEnergyWh:
          output.totalDailyEnergyWh,
      },
      unit: "Wh",
      sequence: 1,
    },

    {
      id: "energy-monthly-energy",
      name: "Monthly Energy",
      description:
        "Calculate monthly energy from daily energy and operating days.",
      formula:
        "monthlyEnergyWh = dailyEnergyWh × operatingDaysPerMonth",
      inputs: {
        dailyEnergyWh:
          output.totalDailyEnergyWh,
        loads: input.loads.map((load) => ({
          loadId: load.loadId,
          operatingDaysPerMonth:
            load.operatingDaysPerMonth,
        })),
      },
      outputs: {
        totalMonthlyEnergyWh:
          output.totalMonthlyEnergyWh,
      },
      unit: "Wh",
      sequence: 2,
    },

    {
      id: "energy-annual-energy",
      name: "Annual Energy",
      description:
        "Calculate annual energy from monthly energy using the configured months-per-year constant.",
      formula:
        "annualEnergyWh = monthlyEnergyWh × monthsPerYear",
      inputs: {
        monthlyEnergyWh:
          output.totalMonthlyEnergyWh,
        monthsPerYear:
  ENERGY_DEFAULTS.monthsPerYear,
      },
      outputs: {
        totalAnnualEnergyWh:
          output.totalAnnualEnergyWh,
      },
      unit: "Wh",
      sequence: 3,
    },

    {
      id: "energy-system-loss-adjustment",
      name: "System Loss Adjustment",
      description:
        "Adjust energy to account for the configured system loss factor.",
      formula:
        "adjustedEnergyWh = energyWh × (1 / (1 - systemLossFactor))",
      inputs: {
        totalDailyEnergyWh:
          output.totalDailyEnergyWh,
        totalMonthlyEnergyWh:
          output.totalMonthlyEnergyWh,
        totalAnnualEnergyWh:
          output.totalAnnualEnergyWh,
        systemLossFactor:
          input.systemLossFactor ?? 0,
      },
      outputs: {
        adjustmentFactor:
          output.adjustmentFactor,
        adjustedDailyEnergyWh:
          output.adjustedDailyEnergyWh,
        adjustedMonthlyEnergyWh:
          output.adjustedMonthlyEnergyWh,
        adjustedAnnualEnergyWh:
          output.adjustedAnnualEnergyWh,
      },
      unit: "Wh",
      sequence: 4,
    },

    {
      id: "energy-design-margin",
      name: "Energy Design Margin",
      description:
        "Apply the configured design margin after system loss adjustment.",
      formula:
        "designEnergyWh = adjustedEnergyWh × (1 + designMargin)",
      inputs: {
        adjustedDailyEnergyWh:
          output.adjustedDailyEnergyWh,
        adjustedMonthlyEnergyWh:
          output.adjustedMonthlyEnergyWh,
        adjustedAnnualEnergyWh:
          output.adjustedAnnualEnergyWh,
        designMargin:
          input.designMargin ?? 0,
      },
      outputs: {
        designDailyEnergyWh:
          output.designDailyEnergyWh,
        designMonthlyEnergyWh:
          output.designMonthlyEnergyWh,
        designAnnualEnergyWh:
          output.designAnnualEnergyWh,
      },
      unit: "Wh",
      sequence: 5,
    },

    {
      id: "energy-output",
      name: "Energy Output",
      description:
        "Produce the final daily, monthly, and annual energy results.",
      inputs: {
        totalDailyEnergyWh:
          output.totalDailyEnergyWh,
        totalMonthlyEnergyWh:
          output.totalMonthlyEnergyWh,
        totalAnnualEnergyWh:
          output.totalAnnualEnergyWh,
        adjustedDailyEnergyWh:
          output.adjustedDailyEnergyWh,
        adjustedMonthlyEnergyWh:
          output.adjustedMonthlyEnergyWh,
        adjustedAnnualEnergyWh:
          output.adjustedAnnualEnergyWh,
      },
      outputs: {
        totalDailyEnergyKWh:
          output.totalDailyEnergyKWh,
        totalMonthlyEnergyKWh:
          output.totalMonthlyEnergyKWh,
        totalAnnualEnergyKWh:
          output.totalAnnualEnergyKWh,
        designDailyEnergyWh:
          output.designDailyEnergyWh,
        designMonthlyEnergyWh:
          output.designMonthlyEnergyWh,
        designAnnualEnergyWh:
          output.designAnnualEnergyWh,
      },
      sequence: 6,
    },
  ];

  return steps;
}
