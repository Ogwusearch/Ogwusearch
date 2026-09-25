import type { InverterSizingInput } from "../types";

export interface DCInputCalculation {
  requiredContinuousInputPowerW: number;
  requiredSurgeInputPowerW: number;
  requiredContinuousDCInputCurrentA: number;
  requiredSurgeDCInputCurrentA: number;
}

export function calculateDCInput(
  input: InverterSizingInput,
): DCInputCalculation {
  const {
    continuousLoadW,
    surgeLoadW,
    systemVoltageV,
    inverterEfficiency,
  } = input;

  const requiredContinuousInputPowerW =
    continuousLoadW /
    inverterEfficiency;

  const requiredSurgeInputPowerW =
    surgeLoadW /
    inverterEfficiency;

  const requiredContinuousDCInputCurrentA =
    requiredContinuousInputPowerW /
    systemVoltageV;

  const requiredSurgeDCInputCurrentA =
    requiredSurgeInputPowerW /
    systemVoltageV;

  return {
    requiredContinuousInputPowerW,
    requiredSurgeInputPowerW,
    requiredContinuousDCInputCurrentA,
    requiredSurgeDCInputCurrentA,
  };
}