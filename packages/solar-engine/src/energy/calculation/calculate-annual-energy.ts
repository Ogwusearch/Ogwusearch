import {
  ENERGY_DEFAULTS,
} from "../constants.js";

export function calculateAnnualEnergy(
  monthlyEnergyWh: number,
): number {
  return (
    monthlyEnergyWh *
    ENERGY_DEFAULTS.monthsPerYear
  );
}
