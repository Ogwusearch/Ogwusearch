import {
  calculateDailyEnergy,
} from "./calculate-daily-energy.js";

import {
  calculateMonthlyEnergy,
} from "./calculate-monthly-energy.js";

import {
  calculateAnnualEnergy,
} from "./calculate-annual-energy.js";

export interface LoadEnergyInput {
  readonly loadId: string;
  readonly runningLoadW: number;
  readonly operatingHoursPerDay: number;
  readonly operatingDaysPerMonth: number;
}

export interface LoadEnergyResult {
  readonly loadId: string;
  readonly dailyEnergyWh: number;
  readonly monthlyEnergyWh: number;
  readonly annualEnergyWh: number;
}

export interface LoadEnergyTotals {
  readonly loads: readonly LoadEnergyResult[];
  readonly totalDailyEnergyWh: number;
  readonly totalMonthlyEnergyWh: number;
  readonly totalAnnualEnergyWh: number;
}

export function calculateLoadEnergy(
  inputs: readonly LoadEnergyInput[],
): LoadEnergyTotals {
  const loads: LoadEnergyResult[] =
    inputs.map((load) => {
      const dailyEnergyWh =
        calculateDailyEnergy(
          load.runningLoadW,
          load.operatingHoursPerDay,
        );

      const monthlyEnergyWh =
        calculateMonthlyEnergy(
          dailyEnergyWh,
          load.operatingDaysPerMonth,
        );

      const annualEnergyWh =
        calculateAnnualEnergy(
          monthlyEnergyWh,
        );

      return {
        loadId: load.loadId,
        dailyEnergyWh,
        monthlyEnergyWh,
        annualEnergyWh,
      };
    });

  const totalDailyEnergyWh =
    loads.reduce(
      (total, load) =>
        total + load.dailyEnergyWh,
      0,
    );

  const totalMonthlyEnergyWh =
    loads.reduce(
      (total, load) =>
        total + load.monthlyEnergyWh,
      0,
    );

  const totalAnnualEnergyWh =
    loads.reduce(
      (total, load) =>
        total + load.annualEnergyWh,
      0,
    );

  return {
    loads,
    totalDailyEnergyWh,
    totalMonthlyEnergyWh,
    totalAnnualEnergyWh,
  };
}
