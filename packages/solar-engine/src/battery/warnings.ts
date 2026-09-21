import type {
  BatterySizingInput,
  BatterySizingValue,
  EngineeringMessage,
} from "./types";

export function generateBatterySizingWarnings(
  input: BatterySizingInput,
  value: BatterySizingValue
): EngineeringMessage[] {
  const warnings: EngineeringMessage[] = [];

  if (input.depthOfDischarge > 0.8) {
    warnings.push({
      code: "HIGH_DEPTH_OF_DISCHARGE",
      field: "depthOfDischarge",
      message:
        "Depth of discharge is above 80%; verify the battery manufacturer's recommended operating limit.",
      value: input.depthOfDischarge,
    });
  }

  if (input.designMargin === 0) {
    warnings.push({
      code: "NO_DESIGN_MARGIN",
      field: "designMargin",
      message:
        "No additional battery design margin has been applied.",
      value: input.designMargin,
    });
  }

  if (
    input.batteryUnitVoltageV !== undefined &&
    input.systemVoltageV % input.batteryUnitVoltageV !== 0
  ) {
    warnings.push({
      code: "NON_INTEGER_SERIES_CONFIGURATION",
      field: "batteryUnitVoltageV",
      message:
        "Battery unit voltage does not divide evenly into the system voltage; series count has been rounded up.",
      value: input.batteryUnitVoltageV,
    });
  }

  if (value.totalBatteryUnits !== undefined) {
    warnings.push({
      code: "VERIFY_BATTERY_CONFIGURATION",
      field: "totalBatteryUnits",
      message:
        "Verify the calculated battery configuration against the battery manufacturer's specifications and installation requirements.",
      value: value.totalBatteryUnits,
    });
  }

  return warnings;
}