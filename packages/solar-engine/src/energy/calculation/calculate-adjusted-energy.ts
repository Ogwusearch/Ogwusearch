import {
  ENERGY_DEFAULTS,
} from "../constants.js";

export interface EnergyAdjustment {
  readonly adjustmentFactor: number;
  readonly adjustedEnergyWh: number;
  readonly designEnergyWh: number;
}

/**
 * Applies system-loss adjustment and design margin.
 *
 * Loss semantics:
 *
 * supplied energy × (1 - loss) = usable energy
 *
 * Therefore:
 *
 * supplied energy =
 * usable energy / (1 - loss)
 */
export function calculateAdjustedEnergy(
  energyWh: number,
  systemLossFactor = ENERGY_DEFAULTS.systemLossFactor,
  designMargin = ENERGY_DEFAULTS.designMargin,
): EnergyAdjustment {
  const adjustmentFactor =
    1 /
    (1 - systemLossFactor);

  const adjustedEnergyWh =
    energyWh *
    adjustmentFactor;

  const designEnergyWh =
    adjustedEnergyWh *
    (1 + designMargin);

  return {
    adjustmentFactor,
    adjustedEnergyWh,
    designEnergyWh,
  };
}
