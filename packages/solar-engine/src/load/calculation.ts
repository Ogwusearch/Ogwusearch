
import type {
  CalculationOutput,
  CalculationTrace
} from "@ogwusearch/engineering-types";

import type {
  LoadAuditInput,
  LoadItemInput
} from "./input";

import type {
  LoadAuditResult,
  LoadItemResult
} from "./result";

import { LOAD_AUDIT_CONSTANTS } from "./constants";
import { buildLoadAuditTrace } from "./trace";

function calculateLoadItem(
  load: LoadItemInput
): LoadItemResult {
  const totalPowerW =
    load.quantity * load.ratedPowerW;

  const dailyEnergyWh =
    totalPowerW * load.hoursPerDay;

  const daysPerWeek =
    load.daysPerWeek ??
    LOAD_AUDIT_CONSTANTS.DEFAULT_DAYS_PER_WEEK;

  const weeklyEnergyWh =
    dailyEnergyWh * daysPerWeek;

  const baseResult = {
    appliance: load.appliance,
    quantity: load.quantity,

    ratedPowerW: load.ratedPowerW,
    totalPowerW,

    hoursPerDay: load.hoursPerDay,

    dailyEnergyWh,
    dailyEnergyKWh:
      dailyEnergyWh /
      LOAD_AUDIT_CONSTANTS.WH_PER_KWH,

    weeklyEnergyWh,
    weeklyEnergyKWh:
      weeklyEnergyWh /
      LOAD_AUDIT_CONSTANTS.WH_PER_KWH
  };

  if (load.powerFactor !== undefined) {
    return {
      ...baseResult,
      powerFactor: load.powerFactor,
      apparentPowerVA:
        totalPowerW / load.powerFactor
    };
  }

  return baseResult;
}

export function calculateLoadAudit(
  input: LoadAuditInput
): CalculationOutput<LoadAuditResult> {
  const loads = input.loads.map(
    calculateLoadItem
  );

  const totalConnectedLoadW =
    loads.reduce(
      (sum, load) =>
        sum + load.totalPowerW,
      0
    );

  const totalDailyEnergyWh =
    loads.reduce(
      (sum, load) =>
        sum + load.dailyEnergyWh,
      0
    );

  const totalWeeklyEnergyWh =
    loads.reduce(
      (sum, load) =>
        sum + load.weeklyEnergyWh,
      0
    );

  const diversifiedLoadW =
    totalConnectedLoadW *
    input.diversityFactor;

  const designLoadW =
    diversifiedLoadW *
    (1 + input.designMargin);

  const value: LoadAuditResult = {
    loads,

    totalConnectedLoadW,
    totalConnectedLoadKW:
      totalConnectedLoadW / 1000,

    diversifiedLoadW,
    diversifiedLoadKW:
      diversifiedLoadW / 1000,

    designLoadW,
    designLoadKW:
      designLoadW / 1000,

    totalDailyEnergyWh,
    totalDailyEnergyKWh:
      totalDailyEnergyWh / 1000,

    totalWeeklyEnergyWh,
    totalWeeklyEnergyKWh:
      totalWeeklyEnergyWh / 1000,

    diversityFactor:
      input.diversityFactor,

    designMargin:
      input.designMargin
  };

  const trace: CalculationTrace =
    buildLoadAuditTrace(
      input,
      value
    );

  return {
    value,
    trace
  };
}