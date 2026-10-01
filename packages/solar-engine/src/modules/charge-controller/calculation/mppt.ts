
import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "../types/index.js";

export function calculateMPPTCompatibility(
  input: ChargeControllerSizingInput,
): Pick<ChargeControllerSizingValue, "mpptCompatible"> {
  const {
    pvArrayVmpV,
    controllerMPPTMinVoltageV,
    controllerMPPTMaxVoltageV,
  } = input;

  if (
    pvArrayVmpV === undefined ||
    controllerMPPTMinVoltageV === undefined ||
    controllerMPPTMaxVoltageV === undefined
  ) {
    return {};
  }

  return {
    mpptCompatible:
      pvArrayVmpV >= controllerMPPTMinVoltageV &&
      pvArrayVmpV <= controllerMPPTMaxVoltageV,
  };
}
