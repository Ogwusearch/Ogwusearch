
import { describe, expect, it } from "vitest";

import {
  calculateBatterySizing,
} from "../calculation/index.js";

import {
  runBatterySizing,
} from "../run.js";

import type {
  BatterySizingInput,
} from "../types/index.js";

describe("Battery regression", () => {
  const baseInput: BatterySizingInput = {
    dailyEnergyKWh: 2.4,
    autonomyDays: 1,
    systemVoltageV: 24,
    depthOfDischarge: 0.5,
    batteryEfficiency: 0.9,
    designMargin: 0.1,
  };

  describe("formula preservation", () => {
    it("preserves the required battery energy calculation", () => {
      const result =
        calculateBatterySizing(baseInput);

      expect(
        result.requiredBatteryEnergyKWh,
      ).toBeCloseTo(2.4);
    });

    it("preserves the adjusted battery energy calculation", () => {
      const result =
        calculateBatterySizing(baseInput);

      const expected =
        (2.4 / 0.9 / 0.5) * 1.1;

      expect(
        result.adjustedBatteryEnergyKWh,
      ).toBeCloseTo(expected);
    });

    it("preserves the required battery capacity calculation", () => {
      const result =
        calculateBatterySizing(baseInput);

      const expected =
        ((2.4 / 0.9 / 0.5) * 1.1 * 1000) /
        24;

      expect(
        result.requiredBatteryCapacityAh,
      ).toBeCloseTo(expected);
    });

    it("preserves the physical battery configuration calculation", () => {
      const input: BatterySizingInput = {
        ...baseInput,
        batteryUnitVoltageV: 12,
        batteryUnitCapacityAh: 200,
      };

      const result =
        calculateBatterySizing(input);

      expect(result.seriesBatteries).toBe(2);
      expect(result.parallelStrings).toBe(2);
      expect(result.totalBatteryUnits).toBe(4);

      expect(
        result.installedBatteryCapacityAh,
      ).toBe(400);

      expect(
        result.installedBatteryEnergyKWh,
      ).toBe(9.6);
    });
  });

  describe("determinism", () => {
    it("produces identical results for identical inputs", () => {
      const first =
        calculateBatterySizing(baseInput);

      const second =
        calculateBatterySizing(baseInput);

      expect(second).toEqual(first);
    });

    it("produces identical runner results for identical inputs", () => {
      const first =
        runBatterySizing(baseInput);

      const second =
        runBatterySizing(baseInput);

      expect(second).toEqual(first);
    });
  });

  describe("input immutability", () => {
    it("does not mutate the battery sizing input", () => {
      const input: BatterySizingInput = {
        ...baseInput,
        batteryUnitVoltageV: 12,
        batteryUnitCapacityAh: 200,
      };

      const before =
        structuredClone(input);

      calculateBatterySizing(input);

      expect(input).toEqual(before);
    });

    it("does not mutate input when executed through the runner", () => {
      const input: BatterySizingInput = {
        ...baseInput,
        batteryUnitVoltageV: 12,
        batteryUnitCapacityAh: 200,
      };

      const before =
        structuredClone(input);

      runBatterySizing(input);

      expect(input).toEqual(before);
    });
  });

  describe("optional physical configuration", () => {
    it("does not invent battery configuration when unit data is absent", () => {
      const result =
        calculateBatterySizing(baseInput);

      expect(
        result.batteryUnitVoltageV,
      ).toBeUndefined();

      expect(
        result.batteryUnitCapacityAh,
      ).toBeUndefined();

      expect(
        result.seriesBatteries,
      ).toBeUndefined();

      expect(
        result.parallelStrings,
      ).toBeUndefined();

      expect(
        result.totalBatteryUnits,
      ).toBeUndefined();

      expect(
        result.installedBatteryCapacityAh,
      ).toBeUndefined();

      expect(
        result.installedBatteryEnergyKWh,
      ).toBeUndefined();
    });

    it("calculates physical configuration when both unit values are supplied", () => {
      const result =
        calculateBatterySizing({
          ...baseInput,
          batteryUnitVoltageV: 12,
          batteryUnitCapacityAh: 200,
        });

      expect(result.seriesBatteries).toBe(2);
      expect(result.parallelStrings).toBe(2);
      expect(result.totalBatteryUnits).toBe(4);
    });
  });

  describe("rounding behavior", () => {
    it("preserves upward series rounding", () => {
      const result =
        calculateBatterySizing({
          ...baseInput,
          systemVoltageV: 48,
          batteryUnitVoltageV: 15,
          batteryUnitCapacityAh: 200,
        });

      expect(result.seriesBatteries).toBe(4);
    });

    it("preserves upward parallel rounding", () => {
      const result =
        calculateBatterySizing({
          ...baseInput,
          batteryUnitVoltageV: 12,
          batteryUnitCapacityAh: 100,
        });

      expect(
        result.parallelStrings,
      ).toBe(
        Math.ceil(
          result.requiredBatteryCapacityAh /
            100,
        ),
      );
    });
  });

  describe("runner contract", () => {
    it("returns a successful CalculationResult for valid input", () => {
      const result =
        runBatterySizing(baseInput);

      expect(result.valid).toBe(true);
      expect(result.status).toBe("SUCCESS");
      expect(result.errors).toEqual([]);
      expect(result.value).toBeDefined();
    });

    it("returns structured errors for invalid input", () => {
      const result =
        runBatterySizing({
          ...baseInput,
          dailyEnergyKWh: 0,
        });

      expect(result.valid).toBe(false);
      expect(result.status).toBe("ERROR");
      expect(result.value).toBeUndefined();
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "INVALID_DAILY_ENERGY",
            severity: "ERROR",
            path: "dailyEnergyKWh",
          }),
        ]),
      );
    });

    it("does not throw for invalid engineering input", () => {
      expect(() =>
        runBatterySizing({
          ...baseInput,
          systemVoltageV: 0,
        }),
      ).not.toThrow();
    });
  });

  describe("boundary behavior", () => {
    it("accepts depth of discharge equal to one", () => {
      const result =
        runBatterySizing({
          ...baseInput,
          depthOfDischarge: 1,
        });

      expect(result.valid).toBe(true);
    });

    it("accepts battery efficiency equal to one", () => {
      const result =
        runBatterySizing({
          ...baseInput,
          batteryEfficiency: 1,
        });

      expect(result.valid).toBe(true);
    });

    it("accepts zero design margin", () => {
      const result =
        runBatterySizing({
          ...baseInput,
          designMargin: 0,
        });

      expect(result.valid).toBe(true);
    });
  });
});