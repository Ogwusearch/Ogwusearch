import type { InverterSizingInput } from "../types";

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