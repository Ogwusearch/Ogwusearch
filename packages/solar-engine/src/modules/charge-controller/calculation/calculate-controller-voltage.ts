import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "../types/index.js";

export function calculateVoltageCompatibility(
  input: ChargeControllerSizingInput,
): Pick<
  ChargeControllerSizingValue,
  "voltageCompatible"
> {
  if (
    input.pvArrayVocV === undefined ||
    input.controllerMaxPVVoltageV === undefined
  ) {
    return {};
  }

  return {
    voltageCompatible:
      input.pvArrayVocV <=
      input.controllerMaxPVVoltageV,
  };
}
