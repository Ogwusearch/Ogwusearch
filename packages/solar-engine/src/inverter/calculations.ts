import type {
  InverterSizingInput,
  InverterSizingValue,
} from "./types";

export function calculateInverterSizing(
  input: InverterSizingInput
): InverterSizingValue {
  const {
    continuousLoadW,
    surgeLoadW,
    systemVoltageV,
    inverterEfficiency,
    powerFactor,
    inverterRatedPowerW,
    inverterSurgePowerW,
    inverterInputVoltageMinV,
    inverterInputVoltageMaxV,
    requiredOutputVoltageV,
    inverterOutputVoltageV,
  } = input;

  // AC output power required by the connected loads.
  const requiredContinuousOutputPowerW =
    continuousLoadW;

  const requiredSurgeOutputPowerW =
    surgeLoadW;

  // Estimated DC input power after accounting for inverter losses.
  const requiredContinuousInputPowerW =
    continuousLoadW / inverterEfficiency;

  const requiredSurgeInputPowerW =
    surgeLoadW / inverterEfficiency;

  // Apparent power is only calculated when power factor is supplied.
  let requiredContinuousVA: number | undefined;

  if (powerFactor !== undefined) {
    requiredContinuousVA =
      continuousLoadW / powerFactor;
  }

  // DC input current based on estimated DC input power.
  const requiredContinuousDCInputCurrentA =
    requiredContinuousInputPowerW / systemVoltageV;

  const requiredSurgeDCInputCurrentA =
    requiredSurgeInputPowerW / systemVoltageV;

  const result: InverterSizingValue = {
    requiredContinuousOutputPowerW,
    requiredSurgeOutputPowerW,
    requiredContinuousInputPowerW,
    requiredSurgeInputPowerW,
    requiredContinuousDCInputCurrentA,
    requiredSurgeDCInputCurrentA,
  };

  if (requiredContinuousVA !== undefined) {
    result.requiredContinuousVA =
      requiredContinuousVA;
  }

  if (inverterRatedPowerW !== undefined) {
    const continuousMarginW =
      inverterRatedPowerW -
      requiredContinuousOutputPowerW;

    const continuousCompatible =
      continuousMarginW >= 0;

    result.inverterRatedPowerW =
      inverterRatedPowerW;

    result.continuousMarginW =
      continuousMarginW;

    result.continuousCompatible =
      continuousCompatible;
  }

  if (inverterSurgePowerW !== undefined) {
    const surgeMarginW =
      inverterSurgePowerW -
      requiredSurgeOutputPowerW;

    const surgeCompatible =
      surgeMarginW >= 0;

    result.inverterSurgePowerW =
      inverterSurgePowerW;

    result.surgeMarginW =
      surgeMarginW;

    result.surgeCompatible =
      surgeCompatible;
  }

  if (
    inverterInputVoltageMinV !== undefined &&
    inverterInputVoltageMaxV !== undefined
  ) {
    const inputVoltageCompatible =
      systemVoltageV >= inverterInputVoltageMinV &&
      systemVoltageV <= inverterInputVoltageMaxV;

    result.inputVoltageCompatible =
      inputVoltageCompatible;
  }

  if (
    requiredOutputVoltageV !== undefined &&
    inverterOutputVoltageV !== undefined
  ) {
    const outputVoltageCompatible =
      requiredOutputVoltageV ===
      inverterOutputVoltageV;

    result.outputVoltageCompatible =
      outputVoltageCompatible;
  }

  const compatibilityChecks: boolean[] = [];

  if (result.continuousCompatible !== undefined) {
    compatibilityChecks.push(
      result.continuousCompatible
    );
  }

  if (result.surgeCompatible !== undefined) {
    compatibilityChecks.push(
      result.surgeCompatible
    );
  }

  if (result.inputVoltageCompatible !== undefined) {
    compatibilityChecks.push(
      result.inputVoltageCompatible
    );
  }

  if (
    result.outputVoltageCompatible !== undefined
  ) {
    compatibilityChecks.push(
      result.outputVoltageCompatible
    );
  }

  if (compatibilityChecks.length > 0) {
    result.systemCompatible =
      compatibilityChecks.every(Boolean);
  }

  return result;
}



