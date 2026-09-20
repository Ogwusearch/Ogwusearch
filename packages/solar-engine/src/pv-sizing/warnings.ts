import type {
  EngineeringMessage,
  PVSizingInput,
  PVSizingValue,
} from "./types";

export function generatePVSizingWarnings(
  input: PVSizingInput,
  value: PVSizingValue,
): EngineeringMessage[] {
  const warnings: EngineeringMessage[] = [];

  // Low system efficiency means significantly more PV capacity is required.
  if (input.systemEfficiency < 0.75) {
    warnings.push({
      code: "LOW_SYSTEM_EFFICIENCY",
      field: "systemEfficiency",
      message:
        "System efficiency is below 75%. The required PV capacity may be significantly increased.",
      value: input.systemEfficiency,
    });
  }

  // Very low peak sun hours can produce a large PV array requirement.
  if (input.peakSunHours < 3) {
    warnings.push({
      code: "LOW_PEAK_SUN_HOURS",
      field: "peakSunHours",
      message:
        "Peak sun hours are below 3 hours. The calculated PV capacity may be relatively large.",
      value: input.peakSunHours,
    });
  }

  // Warn when installed capacity substantially exceeds calculated requirement.
  if (
    value.oversizingPercent !== undefined &&
    value.oversizingPercent > 20
  ) {
    warnings.push({
      code: "HIGH_PV_OVERSIZING",
      field: "panelPowerW",
      message:
        "Installed PV capacity exceeds the calculated requirement by more than 20%.",
      value: value.oversizingPercent,
    });
  }

  // Inform when panel count is calculated from an optional panel rating.
  if (
    input.panelPowerW !== undefined &&
    value.requiredPanelCount !== undefined
  ) {
    const exactPanelCount =
      value.requiredPVPowerW / input.panelPowerW;

    if (value.requiredPanelCount > exactPanelCount) {
      warnings.push({
        code: "PANEL_COUNT_ROUNDING",
        field: "panelPowerW",
        message:
          "Panel count was rounded up to the next whole panel, resulting in additional installed PV capacity.",
        value: value.requiredPanelCount,
      });
    }
  }

  return warnings;
}