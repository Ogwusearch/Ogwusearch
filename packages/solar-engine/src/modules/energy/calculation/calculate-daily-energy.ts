import type {
  EnergyLoadInput,
} from "../types/energy-input.js";

export function calculateDailyEnergy(
  load: EnergyLoadInput,
): number {
  return (
    load.runningLoadW *
    load.operatingHoursPerDay
  );
}
