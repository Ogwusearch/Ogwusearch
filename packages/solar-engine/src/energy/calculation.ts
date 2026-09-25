import type {
  EnergyInput,
} from "./types/energy-input.js";

import type {
  EnergyLoadResult,
  EnergyOutput,
} from "./types/energy-output.js";

import {
  ENERGY_DEFAULTS,
} from "./constants.js";

import {
  calculateDailyEnergy,
} from "./calculation/calculate-daily-energy.js";

import {
  calculateMonthlyEnergy,
} from "./calculation/calculate-monthly-energy.js";

import {
  calculateAnnualEnergy,
} from "./calculation/calculate-annual-energy.js";

import {
  calculateAdjustedEnergy,
} from "./calculation/calculate-adjusted-energy.js";

import {
  validateEnergy,
} from "./validation/validate-energy.js";

export interface EnergyCalculationResult {
  readonly valid: boolean;
  readonly output?: EnergyOutput;
  readonly issues: ReturnType<typeof validateEnergy>;
}

export function calculateEnergy(
  input: EnergyInput,
): EnergyCalculationResult {
  const issues = validateEnergy(input);

  if (issues.length > 0) {
    return {
      valid: false,
      issues,
    };
  }

  const systemLossFactor =
    input.systemLossFactor ??
    ENERGY_DEFAULTS.systemLossFactor;

  const designMargin =
    input.designMargin ??
    ENERGY_DEFAULTS.designMargin;

  const loads: EnergyLoadResult[] =
    input.loads.map((load) => {
      const dailyEnergyWh =
        calculateDailyEnergy(load);

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

  const dailyAdjustment =
    calculateAdjustedEnergy(
      totalDailyEnergyWh,
      systemLossFactor,
      designMargin,
    );

  const monthlyAdjustment =
    calculateAdjustedEnergy(
      totalMonthlyEnergyWh,
      systemLossFactor,
      designMargin,
    );

  const annualAdjustment =
    calculateAdjustedEnergy(
      totalAnnualEnergyWh,
      systemLossFactor,
      designMargin,
    );

  const output: EnergyOutput = {
    loads,

    totalDailyEnergyWh,
    totalDailyEnergyKWh:
      totalDailyEnergyWh /
      ENERGY_DEFAULTS.wattHoursPerKilowattHour,

    totalMonthlyEnergyWh,
    totalMonthlyEnergyKWh:
      totalMonthlyEnergyWh /
      ENERGY_DEFAULTS.wattHoursPerKilowattHour,

    totalAnnualEnergyWh,
    totalAnnualEnergyKWh:
      totalAnnualEnergyWh /
      ENERGY_DEFAULTS.wattHoursPerKilowattHour,

    adjustedDailyEnergyWh:
      dailyAdjustment.adjustedEnergyWh,

    adjustedMonthlyEnergyWh:
      monthlyAdjustment.adjustedEnergyWh,

    adjustedAnnualEnergyWh:
      annualAdjustment.adjustedEnergyWh,

    designDailyEnergyWh:
      dailyAdjustment.designEnergyWh,

    designMonthlyEnergyWh:
      monthlyAdjustment.designEnergyWh,

    designAnnualEnergyWh:
      annualAdjustment.designEnergyWh,

    adjustmentFactor:
      dailyAdjustment.adjustmentFactor,
  };

  return {
    valid: true,
    output,
    issues: [],
  };
}
