import type { PVSizingInput, PVSizingValue } from "./types";

export function calculatePVSizing(
  input: PVSizingInput
): PVSizingValue {
  const {
    dailyEnergyKWh,
    peakSunHours,
    systemEfficiency,
    panelPowerW,
  } = input;

  // 1. Energy required from the PV system before losses
  const requiredPVEnergyKWh =
    dailyEnergyKWh / systemEfficiency;

  // 2. Required PV array power
  const requiredPVPowerW =
    (requiredPVEnergyKWh / peakSunHours) * 1000;

  // 3. Convert watts to kilowatts
  const requiredPVPowerKW =
    requiredPVPowerW / 1000;

  const result: PVSizingValue = {
    requiredPVPowerW,
    requiredPVPowerKW,
    requiredPVEnergyKWh,
  };

  // Optional panel sizing
  if (panelPowerW !== undefined) {
    // 4. Number of panels required
    const requiredPanelCount =
      Math.ceil(requiredPVPowerW / panelPowerW);

    // 5. Actual installed PV capacity
    const installedPVCapacityW =
      requiredPanelCount * panelPowerW;

    const installedPVCapacityKW =
      installedPVCapacityW / 1000;

    // 6. Additional capacity installed above calculated requirement
    const oversizingW =
      installedPVCapacityW - requiredPVPowerW;

    const oversizingKW =
      oversizingW / 1000;

    // 7. Oversizing ratio
    const oversizingRatio =
      oversizingW / requiredPVPowerW;

    const oversizingPercent =
      oversizingRatio * 100;

    result.panelPowerW = panelPowerW;
    result.requiredPanelCount = requiredPanelCount;
    result.installedPVCapacityW = installedPVCapacityW;
    result.installedPVCapacityKW = installedPVCapacityKW;
    result.oversizingW = oversizingW;
    result.oversizingKW = oversizingKW;
    result.oversizingRatio = oversizingRatio;
    result.oversizingPercent = oversizingPercent;
  }

  return result;
}