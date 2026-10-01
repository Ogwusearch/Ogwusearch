// ============================================================
// PV Sizing
// Output Types
// ============================================================

import type { CalculationOutput } from "@ogwusearch/engineering-types";

/**
 * Result of the photovoltaic system sizing calculation.
 *
 * Engineering formulas are unchanged from the existing
 * PV sizing implementation.
 */
export interface PVSizingOutput extends CalculationOutput {
  /**
   * Required PV array power.
   *
   * Unit: W
   */
  readonly requiredPVPowerW: number;

  /**
   * Required PV array power.
   *
   * Unit: kW
   */
  readonly requiredPVPowerKW: number;

  /**
   * Required PV energy after accounting for system efficiency.
   *
   * Unit: kWh/day
   */
  readonly requiredPVEnergyKWh: number;

  /**
   * Rated power of one PV module.
   *
   * Unit: W
   *
   * Present only when panelPowerW was supplied.
   */
  readonly panelPowerW?: number;

  /**
   * Required number of PV panels.
   *
   * Present only when panelPowerW was supplied.
   */
  readonly requiredPanelCount?: number;

  /**
   * Installed PV capacity based on the calculated panel count.
   *
   * Unit: W
   *
   * Present only when panelPowerW was supplied.
   */
  readonly installedPVCapacityW?: number;

  /**
   * Installed PV capacity based on the calculated panel count.
   *
   * Unit: kW
   *
   * Present only when panelPowerW was supplied.
   */
  readonly installedPVCapacityKW?: number;

  /**
   * Installed capacity above the required PV power.
   *
   * Unit: W
   *
   * Present only when panelPowerW was supplied.
   */
  readonly oversizingW?: number;

  /**
   * Installed capacity above the required PV power.
   *
   * Unit: kW
   *
   * Present only when panelPowerW was supplied.
   */
  readonly oversizingKW?: number;

  /**
   * Oversizing as a ratio.
   *
   * Present only when panelPowerW was supplied.
   */
  readonly oversizingRatio?: number;

  /**
   * Oversizing as a percentage.
   *
   * Present only when panelPowerW was supplied.
   */
  readonly oversizingPercent?: number;
}

/**
 * Backward-compatible alias for PVSizingOutput.
 */
export type PVSizingValue = PVSizingOutput;