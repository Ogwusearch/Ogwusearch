// ============================================================
// PV Sizing
// Panel Count Calculation
// ============================================================

/**
 * Calculates the number of PV panels required.
 *
 * Existing behavior is preserved: panel count is rounded
 * upward because a fractional panel cannot be installed.
 */
export function calculatePanelCount(
  requiredPVPowerW: number,
  panelPowerW: number,
): number {
  return Math.ceil(
    requiredPVPowerW / panelPowerW,
  );
}