import type { InverterSizingInput } from "../types";

import {
  calculateContinuousPower,
} from "./calculate-continuous-power";

import {
  calculateSurgeRequirement,
} from "./calculate-surge-requirement";

export interface ACOutputCalculation {
  requiredContinuousOutputPowerW: number;
  requiredSurgeOutputPowerW: number;
  requiredContinuousVA?: number;
}

export function calculateACOutput(
  input: InverterSizingInput,
): ACOutputCalculation {
  const continuous =
    calculateContinuousPower(input);

  const surge =
    calculateSurgeRequirement(input);

  let requiredContinuousVA:
    | number
    | undefined;

  if (input.powerFactor !== undefined) {
    requiredContinuousVA =
      input.continuousLoadW /
      input.powerFactor;
  }

  return {
    ...continuous,
    ...surge,
    ...(requiredContinuousVA !== undefined
      ? { requiredContinuousVA }
      : {}),
  };
}