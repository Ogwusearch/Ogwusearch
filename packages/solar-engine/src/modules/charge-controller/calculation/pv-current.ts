import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "../types/index.js";

export function calculatePVCurrentCompatibility(
  input: ChargeControllerSizingInput,
): Pick<
  ChargeControllerSizingValue,
  | "pvCurrentCompatible"
  | "pvCurrentMarginA"
> {
  const pvCurrent =
    input.pvArrayIscA ??
    input.pvArrayImpA;

  if (
    pvCurrent === undefined ||
    input.controllerMaxPVCurrentA === undefined
  ) {
    return {};
  }

  return {
    pvCurrentCompatible:
      pvCurrent <=
      input.controllerMaxPVCurrentA,

    pvCurrentMarginA:
      input.controllerMaxPVCurrentA -
      pvCurrent,
  };
}
