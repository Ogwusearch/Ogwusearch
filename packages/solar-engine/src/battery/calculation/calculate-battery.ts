import type {
  BatterySizingInput,
  BatterySizingOutput,
} from "../types/index.js";

import {
  calculateRequiredBatteryEnergyKWh,
  calculateAdjustedBatteryEnergyKWh,
} from "./calculate-energy.js";

import {
  calculateRequiredBatteryCapacityAh,
} from "./calculate-capacity.js";

import {
  calculateSeriesBatteries,
} from "./calculate-series-count.js";

import {
  calculateParallelStrings,
} from "./calculate-parallel-count.js";

export function calculateBatterySizing(
  input: BatterySizingInput,
): BatterySizingOutput {
  const {
    batteryUnitVoltageV,
    batteryUnitCapacityAh,
  } = input;

  const requiredBatteryEnergyKWh =
    calculateRequiredBatteryEnergyKWh(input);

  const adjustedBatteryEnergyKWh =
    calculateAdjustedBatteryEnergyKWh(
      requiredBatteryEnergyKWh,
      input,
    );

  const requiredBatteryCapacityAh =
    calculateRequiredBatteryCapacityAh(
      adjustedBatteryEnergyKWh,
      input,
    );

  if (
    batteryUnitVoltageV !== undefined &&
    batteryUnitCapacityAh !== undefined
  ) {
    const seriesBatteries =
      calculateSeriesBatteries(
        input.systemVoltageV,
        batteryUnitVoltageV,
      );

    const parallelStrings =
      calculateParallelStrings(
        requiredBatteryCapacityAh,
        batteryUnitCapacityAh,
      );

    const totalBatteryUnits =
      seriesBatteries * parallelStrings;

    const installedBatteryCapacityAh =
      parallelStrings * batteryUnitCapacityAh;

    const installedBatteryEnergyKWh =
      (totalBatteryUnits *
        batteryUnitVoltageV *
        batteryUnitCapacityAh) /
      1000;

    return {
      requiredBatteryEnergyKWh,
      adjustedBatteryEnergyKWh,
      requiredBatteryCapacityAh,

      batteryUnitVoltageV,
      batteryUnitCapacityAh,

      seriesBatteries,
      parallelStrings,
      totalBatteryUnits,

      installedBatteryCapacityAh,
      installedBatteryEnergyKWh,
    };
  }

  return {
    requiredBatteryEnergyKWh,
    adjustedBatteryEnergyKWh,
    requiredBatteryCapacityAh,
  };
}