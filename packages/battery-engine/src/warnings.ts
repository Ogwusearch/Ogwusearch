import type {
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import type {
  BatterySizingInput,
  BatterySizingOutput,
} from "./types/index.js";

export function generateBatterySizingWarnings(
  input: BatterySizingInput,
  value: BatterySizingOutput,
): EngineeringWarning[] {
  const warnings: EngineeringWarning[] = [];

  if (input.depthOfDischarge > 0.8) {
    warnings.push({
      code: "HIGH_DEPTH_OF_DISCHARGE",
      severity: "WARNING",
      message:
        "Depth of discharge is above 80%; verify the battery manufacturer's recommended operating limit.",
      path: "depthOfDischarge",
      actual: input.depthOfDischarge,
    });
  }

  if (input.designMargin === 0) {
    warnings.push({
      code: "NO_DESIGN_MARGIN",
      severity: "WARNING",
      message:
        "No additional battery design margin has been applied.",
      path: "designMargin",
      actual: input.designMargin,
    });
  }

  if (
    input.batteryUnitVoltageV !== undefined &&
    input.systemVoltageV %
      input.batteryUnitVoltageV !==
      0
  ) {
    warnings.push({
      code: "NON_INTEGER_SERIES_CONFIGURATION",
      severity: "WARNING",
      message:
        "Battery unit voltage does not divide evenly into the system voltage; series count has been rounded up.",
      path: "batteryUnitVoltageV",
      actual: input.batteryUnitVoltageV,
    });
  }

  if (value.totalBatteryUnits !== undefined) {
    warnings.push({
      code: "VERIFY_BATTERY_CONFIGURATION",
      severity: "WARNING",
      message:
        "Verify the calculated battery configuration against the battery manufacturer's specifications and installation requirements.",
      path: "totalBatteryUnits",
      actual: value.totalBatteryUnits,
    });
  }

  return warnings;
}