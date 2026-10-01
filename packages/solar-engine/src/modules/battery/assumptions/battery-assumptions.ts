
import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

import type {
  BatterySizingInput,
} from "../types/index.js";

export function createBatterySizingAssumptions(
  input: BatterySizingInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [
    {
      code: "BATTERY_DAILY_ENERGY_UNIT",
      name: "Daily Energy Unit",
      value: "kWh/day",
      unit: "kWh/day",
      description:
        "Daily energy demand is expressed in kilowatt-hours per day.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.dailyEnergyKWh",
    },
    {
      code: "BATTERY_AUTONOMY_UNIT",
      name: "Autonomy Period",
      value: input.autonomyDays,
      unit: "days",
      description:
        "Required battery autonomy is expressed in days.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.autonomyDays",
    },
    {
      code: "BATTERY_DEPTH_OF_DISCHARGE",
      name: "Depth of Discharge",
      value: input.depthOfDischarge,
      unit: "ratio",
      description:
        "Battery sizing uses the supplied allowable depth of discharge.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.depthOfDischarge",
    },
    {
      code: "BATTERY_EFFICIENCY",
      name: "Battery Efficiency",
      value: input.batteryEfficiency,
      unit: "ratio",
      description:
        "Battery sizing accounts for the supplied battery efficiency.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.batteryEfficiency",
    },
    {
      code: "BATTERY_DESIGN_MARGIN",
      name: "Design Margin",
      value: input.designMargin,
      unit: "ratio",
      description:
        "Battery sizing applies the supplied design margin.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.designMargin",
    },
    {
      code: "BATTERY_SYSTEM_VOLTAGE",
      name: "System Voltage",
      value: input.systemVoltageV,
      unit: "V",
      description:
        "Required battery capacity is calculated at the supplied system voltage.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.systemVoltageV",
    },
    {
      code: "BATTERY_CONFIGURATION_CONDITION",
      name: "Battery Unit Configuration",
      value:
        input.batteryUnitVoltageV !== undefined &&
        input.batteryUnitCapacityAh !== undefined,
      description:
        "Series and parallel battery configuration is calculated only when both battery unit voltage and unit capacity are supplied.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.batteryUnitVoltageV / BatterySizingInput.batteryUnitCapacityAh",
    },
    {
      code: "BATTERY_CONFIGURATION_ROUNDING",
      name: "Battery Configuration Rounding",
      value: "ceil",
      description:
        "Series battery count and parallel string count are rounded upward to the next whole unit.",
      source: "battery-sizing-calculation",
      reference:
        "calculateSeriesBatteries / calculateParallelStrings",
    },
  ];

  if (
    input.batteryUnitVoltageV !== undefined
  ) {
    assumptions.push({
      code: "BATTERY_UNIT_VOLTAGE",
      name: "Battery Unit Voltage",
      value: input.batteryUnitVoltageV,
      unit: "V",
      description:
        "Optional individual battery unit voltage used for series configuration.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.batteryUnitVoltageV",
    });
  }

  if (
    input.batteryUnitCapacityAh !== undefined
  ) {
    assumptions.push({
      code: "BATTERY_UNIT_CAPACITY",
      name: "Battery Unit Capacity",
      value: input.batteryUnitCapacityAh,
      unit: "Ah",
      description:
        "Optional individual battery unit capacity used for parallel configuration.",
      source: "battery-sizing-input",
      reference:
        "BatterySizingInput.batteryUnitCapacityAh",
    });
  }

  return assumptions;
}
