import type {
  EnergyInput,
} from "./types/energy-input.js";

import type {
  EnergyOutput,
  EnergyLoadResult,
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

/**
 * Pure Energy Analysis calculation.
 *
 * Validation and lifecycle orchestration are handled by
 * runEnergyAnalysis() through engineering-core.
 */
export function calculateEnergy(
  input: EnergyInput,
): EnergyOutput {
  const loadResults: EnergyLoadResult[] =
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
    loadResults.reduce(
      (total, load) =>
        total + load.dailyEnergyWh,
      0,
    );

  const totalMonthlyEnergyWh =
    loadResults.reduce(
      (total, load) =>
        total + load.monthlyEnergyWh,
      0,
    );

  const totalAnnualEnergyWh =
    loadResults.reduce(
      (total, load) =>
        total + load.annualEnergyWh,
      0,
    );

  const systemLossFactor =
    input.systemLossFactor ??
    ENERGY_DEFAULTS.systemLossFactor;

  const designMargin =
    input.designMargin ??
    ENERGY_DEFAULTS.designMargin;

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

  return {
    loads: loadResults,

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
}
