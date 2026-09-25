// ============================================================
// PV Sizing
// Input Types
// ============================================================

import type { CalculationInput } from "@ogwusearch/engineering-types";

/**
 * Input parameters for photovoltaic system sizing.
 *
 * Engineering formulas are intentionally kept unchanged.
 */
export interface PVSizingInput extends CalculationInput {
  /**
   * Total daily energy requirement.
   *
   * Unit: kWh/day
   */
  readonly dailyEnergyKWh: number;

  /**
   * Peak sun hours available at the installation location.
   *
   * Unit: h/day
   */
  readonly peakSunHours: number;

  /**
   * Overall PV system efficiency / performance factor.
   *
   * Example:
   * 0.8 = 80% effective system performance.
   */
  readonly systemEfficiency: number;

  /**
   * Rated power of one PV module.
   *
   * Unit: W
   *
   * Optional because PV array power can be calculated
   * without determining the physical panel count.
   */
  readonly panelPowerW?: number;

  /**
   * Existing compatibility field.
   *
   * Retained for compatibility with the existing API.
   *
   * IMPORTANT:
   * The current PV sizing calculation does not apply
   * designMargin to any engineering formula.
   */
  readonly designMargin?: number;
}