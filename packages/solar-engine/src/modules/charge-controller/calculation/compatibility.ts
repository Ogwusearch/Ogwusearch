
import type { ChargeControllerSizingValue } from "../types/index.js";

export function calculateSystemCompatibility(
  value: ChargeControllerSizingValue,
): Pick<ChargeControllerSizingValue, "systemCompatible"> {
  const checks = [
    value.currentCompatible,
    value.voltageCompatible,
    value.mpptCompatible,
    value.pvCurrentCompatible,
  ].filter((check): check is boolean => check !== undefined);

  if (checks.length === 0) {
    return {};
  }

  return {
    systemCompatible: checks.every(Boolean),
  };
}


