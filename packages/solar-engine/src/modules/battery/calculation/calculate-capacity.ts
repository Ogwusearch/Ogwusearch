import type { BatterySizingInput } from "../types/index.js";

export function calculateRequiredBatteryCapacityAh(
  adjustedBatteryEnergyKWh: number,
  input: BatterySizingInput,
): number {
  return (
    (adjustedBatteryEnergyKWh * 1000) /
    input.systemVoltageV
  );
}
