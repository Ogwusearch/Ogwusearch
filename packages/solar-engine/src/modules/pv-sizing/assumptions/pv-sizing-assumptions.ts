// ============================================================
// PV Sizing
// Assumptions
// ============================================================

import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

import type {
  PVSizingInput,
} from "../types/index.js";

/**
 * Creates the engineering assumptions used by PV sizing.
 *
 * This function records input assumptions only.
 * It does not perform calculations.
 */
export function createPVSizingAssumptions(
  input: PVSizingInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [
    {
      code: "DAILY_ENERGY_REQUIREMENT",
      name: "Daily Energy Requirement",
      value: input.dailyEnergyKWh,
      unit: "kWh/day",
      description:
        "Daily energy requirement used for PV system sizing.",
      source: "User input",
    },
    {
      code: "PEAK_SUN_HOURS",
      name: "Peak Sun Hours",
      value: input.peakSunHours,
      unit: "h/day",
      description:
        "Peak sun hours available at the installation location.",
      source: "User input",
    },
    {
      code: "SYSTEM_EFFICIENCY",
      name: "System Efficiency",
      value: input.systemEfficiency,
      unit: "ratio",
      description:
        "Overall PV system efficiency used to account for system losses.",
      source: "User input",
    },
  ];

  if (input.panelPowerW !== undefined) {
    assumptions.push({
      code: "PANEL_POWER",
      name: "Panel Power",
      value: input.panelPowerW,
      unit: "W",
      description:
        "Rated power of one PV module used for physical panel sizing.",
      source: "User input",
    });
  }

  return assumptions;
}