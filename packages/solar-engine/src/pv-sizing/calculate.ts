import type { PVSizingInput, PVSizingValue } from "./types";

export function calculatePVSizing(
  input: PVSizingInput,
): PVSizingValue {
  const {
    dailyEnergyKWh,
    peakSunHours,
    systemEfficiency,
    panelPowerW,
  } = input;

  // Energy that must be supplied by the PV system
  // after accounting for system losses.
  const requiredPVEnergyKWh =
    dailyEnergyKWh / systemEfficiency;

  // Required PV array power.
  const requiredPVPowerW =
    (requiredPVEnergyKWh / peakSunHours) * 1000;

  // Convert watts to kilowatts.
  const requiredPVPowerKW =
    requiredPVPowerW / 1000;

  const result: PVSizingValue = {
    requiredPVPowerW,
    requiredPVPowerKW,
    requiredPVEnergyKWh,
  };

  // Optional physical panel sizing.
  if (panelPowerW !== undefined) {
    // Round up because a fractional panel cannot be installed.
    const requiredPanelCount =
      Math.ceil(requiredPVPowerW / panelPowerW);

    // Actual installed capacity after rounding panel count.
    const installedPVCapacityW =
      requiredPanelCount * panelPowerW;

    const installedPVCapacityKW =
      installedPVCapacityW / 1000;

    // Capacity installed above the calculated requirement.
    const oversizingW =
      installedPVCapacityW - requiredPVPowerW;

    const oversizingKW =
      oversizingW / 1000;

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