import type { InverterSizingInput } from "../types";

export interface InverterCapacityCalculation {
  inverterRatedPowerW?: number;
  continuousMarginW?: number;
  continuousCompatible?: boolean;

  inverterSurgePowerW?: number;
  surgeMarginW?: number;
  surgeCompatible?: boolean;
}

export function calculateInverterCapacity(
  input: InverterSizingInput,
  requiredContinuousOutputPowerW: number,
  requiredSurgeOutputPowerW: number,
): InverterCapacityCalculation {
  const result: InverterCapacityCalculation = {};

  if (input.inverterRatedPowerW !== undefined) {
    const continuousMarginW =
      input.inverterRatedPowerW -
      requiredContinuousOutputPowerW;

    result.inverterRatedPowerW =
      input.inverterRatedPowerW;

    result.continuousMarginW =
      continuousMarginW;

    result.continuousCompatible =
      continuousMarginW >= 0;
  }

  if (input.inverterSurgePowerW !== undefined) {
    const surgeMarginW =
      input.inverterSurgePowerW -
      requiredSurgeOutputPowerW;

    result.inverterSurgePowerW =
      input.inverterSurgePowerW;

    result.surgeMarginW =
      surgeMarginW;

    result.surgeCompatible =
      surgeMarginW >= 0;
  }

  return result;
}