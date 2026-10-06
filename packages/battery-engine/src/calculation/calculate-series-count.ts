export function calculateSeriesBatteries(
  systemVoltageV: number,
  batteryUnitVoltageV: number,
): number {
  return Math.ceil(
    systemVoltageV / batteryUnitVoltageV,
  );
}
