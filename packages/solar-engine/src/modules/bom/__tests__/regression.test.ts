import { describe, expect, it } from "vitest";

import {
  collectBOMItems,
  aggregateBOMItems,
} from "../calculation/index.js";

import {
  runBOM,
} from "../run.js";

import type {
  BOMInput,
  BOMItem,
} from "../types/index.js";

function successfulResult(
  value: Record<string, unknown>,
) {
  return {
    status: "SUCCESS" as const,
    valid: true,
    value,
    errors: [],
    warnings: [],
    assumptions: [],
    trace: {
      steps: [],
    },
    metadata: {},
  };
}

describe("BOM regression", () => {
  it("produces deterministic output", () => {
    const input: BOMInput = {
      pv: successfulResult({
        totalModules: 24,
        modulesPerString: 12,
        parallelStrings: 2,
        arrayPowerW: 13_200,
      }),
      battery: successfulResult({
        totalBatteryUnits: 8,
        batteryUnitVoltageV: 12,
        batteryUnitCapacityAh: 200,
      }),
      cable: successfulResult({
        mode: "DC",
        conductorMaterial: "Copper",
        selectedConductorAreaMm2: 16,
        cableLengthM: 85.37,
      }),
    };

    const first = runBOM(input);
    const second = runBOM(input);

    expect(second).toEqual(first);
  });

  it("does not mutate the input", () => {
    const input: BOMInput = {
      pv: successfulResult({
        totalModules: 24,
        arrayPowerW: 13_200,
      }),
      battery: successfulResult({
        totalBatteryUnits: 8,
      }),
      cable: successfulResult({
        mode: "DC",
        conductorMaterial: "Copper",
        selectedConductorAreaMm2: 16,
        cableLengthM: 85.37,
      }),
    };

    const before = structuredClone(input);

    runBOM(input);

    expect(input).toEqual(before);
  });

  it("preserves engineering cable precision", () => {
    const items = collectBOMItems({
      cable: successfulResult({
        mode: "DC",
        conductorMaterial: "Copper",
        selectedConductorAreaMm2: 10,
        cableLengthM: 85.37,
      }),
    });

    expect(items[0]?.quantity).toBe(85.37);
  });

  it("does not silently round physical quantities", () => {
    const items = collectBOMItems({
      cable: successfulResult({
        mode: "AC",
        conductorMaterial: "Copper",
        selectedConductorAreaMm2: 6,
        cableLengthM: 17.625,
      }),
    });

    expect(items[0]?.quantity).toBe(17.625);
  });

  it("uses totalModules rather than recalculating module quantity", () => {
    const items = collectBOMItems({
      pv: successfulResult({
        totalModules: 17,
        modulesPerString: 5,
        parallelStrings: 4,
        arrayPowerW: 9_350,
      }),
    });

    expect(items[0]?.quantity).toBe(17);
  });

  it("uses totalBatteryUnits as the authoritative battery quantity", () => {
    const items = collectBOMItems({
      battery: successfulResult({
        totalBatteryUnits: 7,
        seriesBatteries: 2,
        parallelStrings: 4,
      }),
    });

    expect(items[0]?.quantity).toBe(7);
  });

  it("does not invent quantities for quantity-less equipment", () => {
    const input: BOMInput = {
      inverter: successfulResult({
        requiredContinuousOutputPowerW: 5_000,
        requiredSurgeOutputPowerW: 10_000,
      }),
      chargeController: successfulResult({
        requiredControllerCurrentA: 60,
        requiredControllerPowerW: 3_000,
      }),
      protection: successfulResult({
        requiredProtectiveCurrentA: 40,
        requiredVoltageRatingV: 600,
      }),
      earthing: successfulResult({
        selectedEarthConductorAreaMm2: 16,
        selectedBondingConductorAreaMm2: 10,
      }),
    };

    const items = collectBOMItems(input);

    expect(items).toHaveLength(0);
  });

  it("does not use conductorCount to alter cableLengthM", () => {
    const items = collectBOMItems({
      cable: successfulResult({
        mode: "DC",
        conductorCount: 6,
        cableLengthM: 12.5,
        conductorMaterial: "Copper",
        selectedConductorAreaMm2: 4,
      }),
    });

    expect(items[0]?.quantity).toBe(12.5);
  });

  it("does not use object identity when aggregating equivalent items", () => {
    const first: BOMItem = {
      id: "first",
      category: "BATTERY",
      description: "Battery units",
      specification: "12 V / 200 Ah",
      quantity: 2,
      unit: "units",
      quantityKind: "COUNT",
      source: {
        module: "battery",
        reference: "totalBatteryUnits",
      },
    };

    const second: BOMItem = {
      id: "second",
      category: "BATTERY",
      description: "Battery units",
      specification: "12 V / 200 Ah",
      quantity: 3,
      unit: "units",
      quantityKind: "COUNT",
      source: {
        module: "battery",
        reference: "totalBatteryUnits",
      },
    };

    const result = aggregateBOMItems([
      first,
      second,
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]?.quantity).toBe(5);
  });

  it("keeps distinct specifications separate", () => {
    const first: BOMItem = {
      id: "battery-200",
      category: "BATTERY",
      description: "Battery units",
      specification: "12 V / 200 Ah",
      quantity: 2,
      unit: "units",
      quantityKind: "COUNT",
      source: {
        module: "battery",
        reference: "totalBatteryUnits",
      },
    };

    const second: BOMItem = {
      id: "battery-250",
      category: "BATTERY",
      description: "Battery units",
      specification: "12 V / 250 Ah",
      quantity: 3,
      unit: "units",
      quantityKind: "COUNT",
      source: {
        module: "battery",
        reference: "totalBatteryUnits",
      },
    };

    const result = aggregateBOMItems([
      first,
      second,
    ]);

    expect(result).toHaveLength(2);
  });

  it("returns SUCCESS for a valid BOM", () => {
    const result = runBOM({
      pv: successfulResult({
        totalModules: 20,
        arrayPowerW: 11_000,
      }),
    });

    expect(result.valid).toBe(true);
    expect(result.status).toBe("SUCCESS");
    expect(result.errors).toHaveLength(0);
    expect(result.value).toBeDefined();
  });

  it("retains assumptions in the calculation result", () => {
    const result = runBOM({
      pv: successfulResult({
        totalModules: 20,
      }),
    });

    expect(result.assumptions).toEqual([]);
    expect(result.value?.assumptions).toEqual([]);
  });

  it("produces trace data for a successful BOM", () => {
    const result = runBOM({
      pv: successfulResult({
        totalModules: 20,
      }),
    });

    expect(result.valid).toBe(true);
    expect(result.trace).toBeDefined();
    expect(result.trace.steps.length).toBeGreaterThan(0);

    expect(
      result.trace.steps.some(
        (step) =>
          step.name === "Collect source results",
      ),
    ).toBe(true);
  });

  it("does not fabricate data from an invalid source result", () => {
    const result = runBOM({
      pv: {
        status: "ERROR",
        valid: false,
        errors: [
          {
            code: "UPSTREAM_ERROR",
            severity: "ERROR",
            message: "Upstream calculation failed.",
          },
        ],
        warnings: [],
        assumptions: [],
        trace: {
          steps: [],
        },
        metadata: {},
      },
    });

    expect(result.valid).toBe(true);
    expect(result.value?.items).toHaveLength(0);
  });
});