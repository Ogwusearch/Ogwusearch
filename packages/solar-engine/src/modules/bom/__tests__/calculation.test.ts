import { describe, expect, it } from "vitest";

import {
  aggregateBOMItems,
  buildBOM,
  collectBOMItems,
} from "../calculation/index.js";

import type {
  BOMInput,
  BOMItem,
} from "../types/index.js";

describe("BOM calculation", () => {
  it("collects PV module quantity from totalModules", () => {
    const input: BOMInput = {
      pv: {
        status: "SUCCESS",
        valid: true,
        value: {
          totalModules: 12,
          modulesPerString: 6,
          parallelStrings: 2,
          arrayPowerW: 6_600,
          arrayVmpV: 220,
          arrayImpA: 30,
          arrayVocV: 270,
          arrayIscA: 33,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const items = collectBOMItems(input);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "pv-array-modules",
      category: "SOLAR_PANEL",
      description: "PV modules",
      quantity: 12,
      unit: "pcs",
      quantityKind: "COUNT",
      source: {
        module: "pv-array",
        reference: "totalModules",
      },
    });
  });

  it("collects battery quantity from totalBatteryUnits", () => {
    const input: BOMInput = {
      battery: {
        status: "SUCCESS",
        valid: true,
        value: {
          requiredBatteryEnergyKWh: 10,
          adjustedBatteryEnergyKWh: 12,
          requiredBatteryCapacityAh: 250,
          batteryUnitVoltageV: 12,
          batteryUnitCapacityAh: 200,
          seriesBatteries: 2,
          parallelStrings: 2,
          totalBatteryUnits: 4,
          installedBatteryCapacityAh: 400,
          installedBatteryEnergyKWh: 9.6,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const items = collectBOMItems(input);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "battery-units",
      category: "BATTERY",
      description: "Battery units",
      quantity: 4,
      unit: "units",
      quantityKind: "COUNT",
      source: {
        module: "battery",
        reference: "totalBatteryUnits",
      },
    });
  });

  it("collects DC cable length from cableLengthM", () => {
    const input: BOMInput = {
      cable: {
        status: "SUCCESS",
        valid: true,
        value: {
          mode: "DC",
          operatingCurrentA: 20,
          designCurrentA: 25,
          requiredAmpacityA: 30,
          selectedConductorAreaMm2: 6,
          selectedConductorAmpacityA: 40,
          conductorMaterial: "Copper",
          conductorCount: 2,
          cableLengthM: 85.37,
          systemVoltageV: 48,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const items = collectBOMItems(input);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "cable-dc",
      category: "DC_CABLE",
      description: "DC cable",
      quantity: 85.37,
      unit: "m",
      quantityKind: "MEASUREMENT",
      source: {
        module: "cable",
        reference: "cableLengthM",
      },
    });
  });

  it("collects AC cable as AC_CABLE", () => {
    const input: BOMInput = {
      cable: {
        status: "SUCCESS",
        valid: true,
        value: {
          mode: "AC",
          operatingCurrentA: 30,
          designCurrentA: 40,
          requiredAmpacityA: 50,
          selectedConductorAreaMm2: 10,
          selectedConductorAmpacityA: 60,
          conductorMaterial: "Copper",
          conductorCount: 3,
          cableLengthM: 42.5,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const items = collectBOMItems(input);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "cable-ac",
      category: "AC_CABLE",
      quantity: 42.5,
      unit: "m",
      quantityKind: "MEASUREMENT",
    });
  });

  it("does not multiply cable length by conductor count", () => {
    const input: BOMInput = {
      cable: {
        status: "SUCCESS",
        valid: true,
        value: {
          mode: "DC",
          operatingCurrentA: 20,
          designCurrentA: 25,
          requiredAmpacityA: 30,
          selectedConductorAreaMm2: 6,
          selectedConductorAmpacityA: 40,
          conductorMaterial: "Copper",
          conductorCount: 4,
          cableLengthM: 25.25,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const items = collectBOMItems(input);

    expect(items[0]?.quantity).toBe(25.25);
    expect(items[0]?.quantity).not.toBe(101);
  });

  it("does not create an item when a source quantity is unavailable", () => {
    const input: BOMInput = {
      pv: {
        status: "SUCCESS",
        valid: true,
        value: {
          modulesPerString: 10,
          parallelStrings: 2,
          arrayPowerW: 5_500,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
      inverter: {
        status: "SUCCESS",
        valid: true,
        value: {
          requiredContinuousOutputPowerW: 5_000,
          requiredSurgeOutputPowerW: 10_000,
          requiredContinuousInputPowerW: 5_500,
          requiredSurgeInputPowerW: 11_000,
          requiredContinuousDCInputCurrentA: 115,
          requiredSurgeDCInputCurrentA: 230,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const items = collectBOMItems(input);

    expect(items).toHaveLength(0);
  });

  it("does not invent inverter quantity", () => {
    const input: BOMInput = {
      inverter: {
        status: "SUCCESS",
        valid: true,
        value: {
          requiredContinuousOutputPowerW: 5_000,
          requiredSurgeOutputPowerW: 10_000,
          requiredContinuousInputPowerW: 5_500,
          requiredSurgeInputPowerW: 11_000,
          requiredContinuousDCInputCurrentA: 115,
          requiredSurgeDCInputCurrentA: 230,
          inverterRatedPowerW: 6_000,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    };

    const items = collectBOMItems(input);

    expect(items).toHaveLength(0);
  });

  it("aggregates equivalent BOM items", () => {
    const first: BOMItem = {
      id: "cable-dc-1",
      category: "DC_CABLE",
      description: "DC cable",
      specification: "Copper 6 mm²",
      quantity: 20,
      unit: "m",
      quantityKind: "MEASUREMENT",
      source: {
        module: "cable",
        reference: "cableLengthM",
      },
    };

    const second: BOMItem = {
      id: "cable-dc-2",
      category: "DC_CABLE",
      description: "DC cable",
      specification: "Copper 6 mm²",
      quantity: 35.5,
      unit: "m",
      quantityKind: "MEASUREMENT",
      source: {
        module: "cable",
        reference: "cableLengthM",
      },
    };

    const result = aggregateBOMItems([
      first,
      second,
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]?.quantity).toBe(55.5);
  });

  it("does not aggregate items with different specifications", () => {
    const first: BOMItem = {
      id: "cable-6",
      category: "DC_CABLE",
      description: "DC cable",
      specification: "Copper 6 mm²",
      quantity: 20,
      unit: "m",
      quantityKind: "MEASUREMENT",
      source: {
        module: "cable",
        reference: "cableLengthM",
      },
    };

    const second: BOMItem = {
      id: "cable-10",
      category: "DC_CABLE",
      description: "DC cable",
      specification: "Copper 10 mm²",
      quantity: 35,
      unit: "m",
      quantityKind: "MEASUREMENT",
      source: {
        module: "cable",
        reference: "cableLengthM",
      },
    };

    const result = aggregateBOMItems([
      first,
      second,
    ]);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.quantity))
      .toEqual([20, 35]);
  });

  it("builds category summaries", () => {
    const output = buildBOM({
      pv: {
        status: "SUCCESS",
        valid: true,
        value: {
          totalModules: 10,
          arrayPowerW: 5_500,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    });

    expect(output.totalItemCount).toBe(1);
    expect(output.summaries).toHaveLength(1);
    expect(output.summaries[0]).toEqual({
      category: "SOLAR_PANEL",
      itemCount: 1,
      totalQuantity: 10,
      units: ["pcs"],
    });
  });

  it("produces BOM trace steps", () => {
    const output = buildBOM({
      pv: {
        status: "SUCCESS",
        valid: true,
        value: {
          totalModules: 10,
          arrayPowerW: 5_500,
        },
        errors: [],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    });

    expect(output.trace.steps.length)
      .toBeGreaterThan(0);

    expect(
      output.trace.steps.map((step) => step.name),
    ).toEqual([
      "Collect source results",
      "Extract BOM components",
      "Aggregate equivalent items",
    ]);
  });
});