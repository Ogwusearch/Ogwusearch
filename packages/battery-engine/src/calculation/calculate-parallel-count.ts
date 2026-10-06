export function calculateParallelStrings(
  requiredBatteryCapacityAh: number,
  batteryUnitCapacityAh: number,
): number {
  return Math.ceil(
    requiredBatteryCapacityAh /
      batteryUnitCapacityAh,
  );
}
