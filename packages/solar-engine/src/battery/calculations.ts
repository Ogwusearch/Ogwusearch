import type {
  BatterySizingInput,
  BatterySizingValue,
} from "./types";

export function calculateBatterySizing(
  input: BatterySizingInput
): BatterySizingValue {
  const {
    dailyEnergyKWh,
    autonomyDays,
    systemVoltageV,
    depthOfDischarge,
    batteryEfficiency,
    designMargin,
    batteryUnitVoltageV,
    batteryUnitCapacityAh,
  } = input;

  // ------------------------------------------------------------
  // 1. Energy required for the autonomy period
  // ------------------------------------------------------------

  const requiredBatteryEnergyKWh =
    dailyEnergyKWh * autonomyDays;

  // ------------------------------------------------------------
  // 2. Adjust for battery efficiency and allowable DoD
  // ------------------------------------------------------------

  const adjustedBatteryEnergyKWh =
    (requiredBatteryEnergyKWh /
      batteryEfficiency /
      depthOfDischarge) *
    (1 + designMargin);

  // ------------------------------------------------------------
  // 3. Convert energy requirement to Ah
  // ------------------------------------------------------------

  const requiredBatteryCapacityAh =
    (adjustedBatteryEnergyKWh * 1000) /
    systemVoltageV;

  const result: BatterySizingValue = {
    requiredBatteryEnergyKWh,
    adjustedBatteryEnergyKWh,
    requiredBatteryCapacityAh,
  };

  // ------------------------------------------------------------
  // 4. Optional physical battery configuration
  // ------------------------------------------------------------

  if (
    batteryUnitVoltageV !== undefined &&
    batteryUnitCapacityAh !== undefined
  ) {
    const seriesBatteries = Math.ceil(
      systemVoltageV / batteryUnitVoltageV
    );

    const parallelStrings = Math.ceil(
      requiredBatteryCapacityAh /
        batteryUnitCapacityAh
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

    result.batteryUnitVoltageV =
      batteryUnitVoltageV;

    result.batteryUnitCapacityAh =
      batteryUnitCapacityAh;

    result.seriesBatteries =
      seriesBatteries;

    result.parallelStrings =
      parallelStrings;

    result.totalBatteryUnits =
      totalBatteryUnits;

    result.installedBatteryCapacityAh =
      installedBatteryCapacityAh;

    result.installedBatteryEnergyKWh =
      installedBatteryEnergyKWh;
  }

  return result;
}