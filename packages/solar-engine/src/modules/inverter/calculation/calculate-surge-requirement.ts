import type { InverterSizingInput } from "../types/index.js";

export interface SurgeRequirementCalculation {
  requiredSurgeOutputPowerW: number;
}

export function calculateSurgeRequirement(
  input: InverterSizingInput,
): SurgeRequirementCalculation {
  const requiredSurgeOutputPowerW =
    input.surgeLoadW;

  return {
    requiredSurgeOutputPowerW,
  };
}