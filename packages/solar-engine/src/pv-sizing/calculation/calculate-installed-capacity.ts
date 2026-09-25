// ============================================================
// PV Sizing
// Installed Capacity Calculation
// ============================================================

export function calculateInstalledCapacityW(
  requiredPanelCount: number,
  panelPowerW: number,
): number {
  // Actual installed capacity after rounding panel count.
  return requiredPanelCount * panelPowerW;
}

export function calculateInstalledCapacityKW(
  installedPVCapacityW: number,
): number {
  return installedPVCapacityW / 1000;
}