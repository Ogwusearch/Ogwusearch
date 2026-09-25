import type { BatterySizingInput } from "../types";

export function calculateRequiredBatteryEnergyKWh(
  input: BatterySizingInput,
): number {
  return input.dailyEnergyKWh * input.autonomyDays;
}

export function calculateAdjustedBatteryEnergyKWh(
  requiredBatteryEnergyKWh: number,
  input: BatterySizingInput,
): number {
  return (
    (requiredBatteryEnergyKWh /
      input.batteryEfficiency /
      input.depthOfDischarge) *
    (1 + input.designMargin)
  );
}
