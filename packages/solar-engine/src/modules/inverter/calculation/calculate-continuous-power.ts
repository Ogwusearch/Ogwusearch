import type { InverterSizingInput } from "../types/index.js";

export interface ContinuousPowerCalculation {
  requiredContinuousOutputPowerW: number;
}

export function calculateContinuousPower(
  input: InverterSizingInput,
): ContinuousPowerCalculation {
  const requiredContinuousOutputPowerW =
    input.continuousLoadW;

  return {
    requiredContinuousOutputPowerW,
  };
}