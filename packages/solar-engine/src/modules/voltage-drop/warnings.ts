import type {
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import type {
  VoltageDropInput,
  VoltageDropOutput,
} from "./types/index.js";

export function createVoltageDropWarnings(
  input: VoltageDropInput,
  output: VoltageDropOutput,
): EngineeringWarning[] {
  const warnings: EngineeringWarning[] = [];

  if (
    output.loadVoltageV <= 0
  ) {
    warnings.push({
      code:
        "NON_POSITIVE_LOAD_VOLTAGE",
      severity: "WARNING",
      message:
        "Calculated load voltage is zero or negative. Engineering review is required.",
      path:
        "loadVoltageV",
      actual:
        output.loadVoltageV,
    });
  }

  if (
    input.allowableVoltageDropPercent !==
      undefined &&
    output.withinAllowableLimit ===
      false
  ) {
    warnings.push({
      code:
        "VOLTAGE_DROP_EXCEEDS_ALLOWABLE_LIMIT",
      severity: "WARNING",
      message:
        "Calculated voltage drop exceeds the explicitly supplied allowable voltage-drop limit.",
      path:
        "voltageDropPercent",
      expected:
        `<= ${input.allowableVoltageDropPercent}%`,
      actual:
        output.voltageDropPercent,
    });
  }

  return warnings;
}