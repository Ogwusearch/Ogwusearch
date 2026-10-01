import type {
  CalculationTrace,
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  BatterySizingInput,
  BatterySizingOutput,
} from "../types/index.js";

export function createBatterySizingTrace(
  input: BatterySizingInput,
  value: BatterySizingOutput,
): CalculationTrace {
  const steps: CalculationTraceStep[] = [
    {
      id: "BATTERY_REQUIRED_ENERGY",
      name: "Calculate Required Battery Energy",
      description:
        "Calculate the battery energy required for the configured autonomy period.",
      formula:
        "dailyEnergyKWh × autonomyDays",
      inputs: {
        dailyEnergyKWh: input.dailyEnergyKWh,
        autonomyDays: input.autonomyDays,
      },
      outputs: {
        requiredBatteryEnergyKWh:
          value.requiredBatteryEnergyKWh,
      },
      unit: "kWh",
      sequence: 1,
    },

    {
      id: "BATTERY_ADJUSTED_ENERGY",
      name: "Calculate Adjusted Battery Energy",
      description:
        "Adjust required battery energy for battery efficiency, allowable depth of discharge, and design margin.",
      formula:
        "(requiredBatteryEnergyKWh / batteryEfficiency / depthOfDischarge) × (1 + designMargin)",
      inputs: {
        requiredBatteryEnergyKWh:
          value.requiredBatteryEnergyKWh,
        batteryEfficiency:
          input.batteryEfficiency,
        depthOfDischarge:
          input.depthOfDischarge,
        designMargin:
          input.designMargin,
      },
      outputs: {
        adjustedBatteryEnergyKWh:
          value.adjustedBatteryEnergyKWh,
      },
      unit: "kWh",
      sequence: 2,
    },

    {
      id: "BATTERY_REQUIRED_CAPACITY",
      name: "Calculate Required Battery Capacity",
      description:
        "Convert the adjusted battery energy requirement into amp-hours using the nominal system voltage.",
      formula:
        "(adjustedBatteryEnergyKWh × 1000) / systemVoltageV",
      inputs: {
        adjustedBatteryEnergyKWh:
          value.adjustedBatteryEnergyKWh,
        systemVoltageV:
          input.systemVoltageV,
      },
      outputs: {
        requiredBatteryCapacityAh:
          value.requiredBatteryCapacityAh,
      },
      unit: "Ah",
      sequence: 3,
    },
  ];

  if (
    input.batteryUnitVoltageV !== undefined &&
    input.batteryUnitCapacityAh !== undefined &&
    value.seriesBatteries !== undefined &&
    value.parallelStrings !== undefined &&
    value.totalBatteryUnits !== undefined &&
    value.installedBatteryCapacityAh !== undefined &&
    value.installedBatteryEnergyKWh !== undefined
  ) {
    steps.push(
      {
        id: "BATTERY_SERIES_COUNT",
        name: "Calculate Series Battery Count",
        description:
          "Determine the number of battery units required in series to meet the nominal system voltage.",
        formula:
          "ceil(systemVoltageV / batteryUnitVoltageV)",
        inputs: {
          systemVoltageV:
            input.systemVoltageV,
          batteryUnitVoltageV:
            input.batteryUnitVoltageV,
        },
        outputs: {
          seriesBatteries:
            value.seriesBatteries,
        },
        unit: "units",
        sequence: 4,
      },

      {
        id: "BATTERY_PARALLEL_COUNT",
        name: "Calculate Parallel Battery Strings",
        description:
          "Determine the number of parallel battery strings required to meet the required battery capacity.",
        formula:
          "ceil(requiredBatteryCapacityAh / batteryUnitCapacityAh)",
        inputs: {
          requiredBatteryCapacityAh:
            value.requiredBatteryCapacityAh,
          batteryUnitCapacityAh:
            input.batteryUnitCapacityAh,
        },
        outputs: {
          parallelStrings:
            value.parallelStrings,
        },
        unit: "strings",
        sequence: 5,
      },

      {
        id: "BATTERY_TOTAL_UNITS",
        name: "Calculate Total Battery Units",
        description:
          "Calculate the total number of physical battery units.",
        formula:
          "seriesBatteries × parallelStrings",
        inputs: {
          seriesBatteries:
            value.seriesBatteries,
          parallelStrings:
            value.parallelStrings,
        },
        outputs: {
          totalBatteryUnits:
            value.totalBatteryUnits,
        },
        unit: "units",
        sequence: 6,
      },

      {
        id: "BATTERY_INSTALLED_CAPACITY",
        name: "Calculate Installed Battery Capacity",
        description:
          "Calculate the nominal installed battery-bank capacity.",
        formula:
          "parallelStrings × batteryUnitCapacityAh",
        inputs: {
          parallelStrings:
            value.parallelStrings,
          batteryUnitCapacityAh:
            input.batteryUnitCapacityAh,
        },
        outputs: {
          installedBatteryCapacityAh:
            value.installedBatteryCapacityAh,
        },
        unit: "Ah",
        sequence: 7,
      },

      {
        id: "BATTERY_INSTALLED_ENERGY",
        name: "Calculate Installed Battery Energy",
        description:
          "Calculate the nominal energy of the configured battery bank.",
        formula:
          "(totalBatteryUnits × batteryUnitVoltageV × batteryUnitCapacityAh) / 1000",
        inputs: {
          totalBatteryUnits:
            value.totalBatteryUnits,
          batteryUnitVoltageV:
            input.batteryUnitVoltageV,
          batteryUnitCapacityAh:
            input.batteryUnitCapacityAh,
        },
        outputs: {
          installedBatteryEnergyKWh:
            value.installedBatteryEnergyKWh,
        },
        unit: "kWh",
        sequence: 8,
      },
    );
  }

  return {
    steps,
  };
}