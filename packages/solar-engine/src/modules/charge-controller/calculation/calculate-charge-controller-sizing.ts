import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "../types/index.js";

import {
  calculateCurrentRequirements,
  calculateCurrentCompatibility,
} from "./calculate-controller-current.js";

import {
  calculateVoltageCompatibility,
} from "./calculate-controller-voltage.js";

import {
  calculateMPPTCompatibility,
} from "./mppt.js";

import {
  calculatePVCurrentCompatibility,
} from "./pv-current.js";

import {
  calculateSystemCompatibility,
} from "./compatibility.js";

export function calculateChargeControllerSizing(
  input: ChargeControllerSizingInput,
): ChargeControllerSizingValue {
  const currentRequirements =
    calculateCurrentRequirements(input);

  const currentCompatibility =
    calculateCurrentCompatibility(
      input,
      currentRequirements.requiredControllerCurrentA,
    );

  const voltageCompatibility =
    calculateVoltageCompatibility(input);

  const mpptCompatibility =
    calculateMPPTCompatibility(input);

  const pvCurrentCompatibility =
    calculatePVCurrentCompatibility(input);

  const intermediate: ChargeControllerSizingValue = {
    ...currentRequirements,
    ...currentCompatibility,
    ...voltageCompatibility,
    ...mpptCompatibility,
    ...pvCurrentCompatibility,

    ...(input.pvArrayImpA !== undefined && {
      pvArrayImpA: input.pvArrayImpA,
    }),

    ...(input.pvArrayIscA !== undefined && {
      pvArrayIscA: input.pvArrayIscA,
    }),
  };

  const systemCompatibility =
    calculateSystemCompatibility(intermediate);

  return {
    ...intermediate,
    ...systemCompatibility,
  };
}