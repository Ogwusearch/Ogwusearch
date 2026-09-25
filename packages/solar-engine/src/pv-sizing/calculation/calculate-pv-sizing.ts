// ============================================================
// PV Sizing
// Main Calculation
// ============================================================

import type {
  PVSizingInput,
  PVSizingOutput,
} from "../types/index.js";

import { calculatePVEnergy } from "./calculate-pv-energy.js";

import {
  calculateArraySizeKW,
  calculateArraySizeW,
} from "./calculate-array-size.js";

import { calculatePanelCount } from "./calculate-panel-count.js";

import {
  calculateInstalledCapacityKW,
  calculateInstalledCapacityW,
} from "./calculate-installed-capacity.js";

/**
 * Performs the PV sizing calculation.
 *
 * The existing PV sizing engineering formulas are preserved.
 */
export function calculatePVSizing(
  input: PVSizingInput,
): PVSizingOutput {
  const {
    dailyEnergyKWh,
    peakSunHours,
    systemEfficiency,
    panelPowerW,
  } = input;

  // ----------------------------------------------------------
  // Required PV energy
  // ----------------------------------------------------------

  const requiredPVEnergyKWh =
    calculatePVEnergy(
      dailyEnergyKWh,
      systemEfficiency,
    );

  // ----------------------------------------------------------
  // Required PV array power
  // ----------------------------------------------------------

  const requiredPVPowerW =
    calculateArraySizeW(
      requiredPVEnergyKWh,
      peakSunHours,
    );

  const requiredPVPowerKW =
    calculateArraySizeKW(
      requiredPVPowerW,
    );

  // ----------------------------------------------------------
  // Base result
  // ----------------------------------------------------------

  if (panelPowerW === undefined) {
    return {
      requiredPVPowerW,
      requiredPVPowerKW,
      requiredPVEnergyKWh,
    };
  }

  // ----------------------------------------------------------
  // Physical panel sizing
  // ----------------------------------------------------------

  const requiredPanelCount =
    calculatePanelCount(
      requiredPVPowerW,
      panelPowerW,
    );

  const installedPVCapacityW =
    calculateInstalledCapacityW(
      requiredPanelCount,
      panelPowerW,
    );

  const installedPVCapacityKW =
    calculateInstalledCapacityKW(
      installedPVCapacityW,
    );

  // ----------------------------------------------------------
  // Oversizing
  // ----------------------------------------------------------

  const oversizingW =
    installedPVCapacityW -
    requiredPVPowerW;

  const oversizingKW =
    oversizingW / 1000;

  const oversizingRatio =
    oversizingW /
    requiredPVPowerW;

  const oversizingPercent =
    oversizingRatio * 100;

  // ----------------------------------------------------------
  // Complete result
  // ----------------------------------------------------------

  return {
    requiredPVPowerW,
    requiredPVPowerKW,
    requiredPVEnergyKWh,

    panelPowerW,
    requiredPanelCount,

    installedPVCapacityW,
    installedPVCapacityKW,

    oversizingW,
    oversizingKW,
    oversizingRatio,
    oversizingPercent,
  };
}