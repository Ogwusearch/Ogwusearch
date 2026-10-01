import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  BOMInput,
  BOMItem,
} from "../types/index.js";

function sourceIsUsable(
  result: CalculationResult | undefined,
): result is CalculationResult & {
  readonly value: Record<string, unknown>;
} {
  return (
    result !== undefined &&
    result.valid &&
    result.value !== undefined
  );
}

export function collectBOMItems(
  input: BOMInput,
): BOMItem[] {
  const items: BOMItem[] = [];

  if (sourceIsUsable(input.pv)) {
    const value = input.pv.value;

    const totalModules =
      value.totalModules;

    if (
      typeof totalModules === "number" &&
      Number.isFinite(totalModules) &&
      totalModules > 0
    ) {
      items.push({
        id: "pv-array-modules",
        category: "SOLAR_PANEL",
        description: "PV modules",
        specification:
          typeof value.arrayPowerW === "number"
            ? `${value.arrayPowerW} W array`
            : "PV array modules",
        quantity: totalModules,
        unit: "pcs",
        quantityKind: "COUNT",
        source: {
          module: "pv-array",
          reference: "totalModules",
        },
      });
    }
  }

  if (sourceIsUsable(input.battery)) {
    const value = input.battery.value;

    const totalBatteryUnits =
      value.totalBatteryUnits;

    if (
      typeof totalBatteryUnits === "number" &&
      Number.isFinite(totalBatteryUnits) &&
      totalBatteryUnits > 0
    ) {
      const specificationParts: string[] = [];

      if (
        typeof value.batteryUnitVoltageV === "number"
      ) {
        specificationParts.push(
          `${value.batteryUnitVoltageV} V`,
        );
      }

      if (
        typeof value.batteryUnitCapacityAh === "number"
      ) {
        specificationParts.push(
          `${value.batteryUnitCapacityAh} Ah`,
        );
      }

      items.push({
        id: "battery-units",
        category: "BATTERY",
        description: "Battery units",
        specification:
          specificationParts.join(" / ") ||
          "Battery units",
        quantity: totalBatteryUnits,
        unit: "units",
        quantityKind: "COUNT",
        source: {
          module: "battery",
          reference: "totalBatteryUnits",
        },
      });
    }
  }

  if (sourceIsUsable(input.cable)) {
    const value = input.cable.value;

    const cableLengthM =
      value.cableLengthM;

    if (
      typeof cableLengthM === "number" &&
      Number.isFinite(cableLengthM) &&
      cableLengthM > 0
    ) {
      const mode =
        value.mode === "AC"
          ? "AC_CABLE"
          : "DC_CABLE";

      const specificationParts: string[] = [];

      if (
        typeof value.conductorMaterial ===
        "string"
      ) {
        specificationParts.push(
          value.conductorMaterial,
        );
      }

      if (
        typeof value.selectedConductorAreaMm2 ===
        "number"
      ) {
        specificationParts.push(
          `${value.selectedConductorAreaMm2} mm²`,
        );
      }

      items.push({
        id: `cable-${
  typeof value.mode === "string"
    ? value.mode.toLowerCase()
    : "unknown"
}`,
        category: mode,
        description:
          value.mode === "AC"
            ? "AC cable"
            : "DC cable",
        specification:
          specificationParts.join(" ") ||
          "Cable",
        quantity: cableLengthM,
        unit: "m",
        quantityKind: "MEASUREMENT",
        source: {
          module: "cable",
          reference: "cableLengthM",
        },
      });
    }
  }

  return items;
}
