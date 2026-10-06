
import { describe, expect, it } from "vitest";

import {
  calculateBatterySizing,
} from "../calculation/calculate-battery.js";

import {
  calculateRequiredBatteryEnergyKWh,
  calculateAdjustedBatteryEnergyKWh,
} from "../calculation/calculate-energy.js";

import {
  calculateRequiredBatteryCapacityAh,
} from "../calculation/calculate-capacity.js";

import {
  calculateSeriesBatteries,
} from "../calculation/calculate-series-count.js";

import {
  calculateParallelStrings,
} from "../calculation/calculate-parallel-count.js";

import type {
  BatterySizingInput,
} from "../types/index.js";

describe("Battery calculation", () => {
  const validInput: BatterySizingInput = {
    dailyEnergyKWh: 2.4,
    autonomyDays: 1,
    systemVoltageV: 24,
    depthOfDischarge: 0.5,
    batteryEfficiency: 0.9,
    designMargin: 0.1,
  };

  describe("calculateRequiredBatteryEnergyKWh", () => {
    it("calculates energy required for the autonomy period", () => {
      const result =
        calculateRequiredBatteryEnergyKWh(
          validInput,
        );

      expect(result).toBeCloseTo(2.4);
    });

    it("scales with autonomy", () => {
      const result =
        calculateRequiredBatteryEnergyKWh({
          ...validInput,
          autonomyDays: 3,
        });

      expect(result).toBeCloseTo(7.2);
    });
  });

  describe("calculateAdjustedBatteryEnergyKWh", () => {
    it("adjusts energy for efficiency, depth of discharge, and margin", () => {
      const requiredEnergy =
        calculateRequiredBatteryEnergyKWh(
          validInput,
        );

      const result =
        calculateAdjustedBatteryEnergyKWh(
          requiredEnergy,
          validInput,
        );

      expect(result).toBeCloseTo(
        (2.4 / 0.9 / 0.5) * 1.1,
      );
    });

    it("increases when depth of discharge decreases", () => {
      const requiredEnergy =
        calculateRequiredBatteryEnergyKWh(
          validInput,
        );

      const normal =
        calculateAdjustedBatteryEnergyKWh(
          requiredEnergy,
          validInput,
        );

      const lowerDoD =
        calculateAdjustedBatteryEnergyKWh(
          requiredEnergy,
          {
            ...validInput,
            depthOfDischarge: 0.4,
          },
        );

      expect(lowerDoD).toBeGreaterThan(normal);
    });

    it("increases when design margin increases", () => {
      const requiredEnergy =
        calculateRequiredBatteryEnergyKWh(
          validInput,
        );

      const normal =
        calculateAdjustedBatteryEnergyKWh(
          requiredEnergy,
          validInput,
        );

      const largerMargin =
        calculateAdjustedBatteryEnergyKWh(
          requiredEnergy,
          {
            ...validInput,
            designMargin: 0.25,
          },
        );

      expect(largerMargin).toBeGreaterThan(normal);
    });
  });

  describe("calculateRequiredBatteryCapacityAh", () => {
    it("converts adjusted energy to required Ah", () => {
      const adjustedEnergy =
        2.4 / 0.9 / 0.5 * 1.1;

      const result =
        calculateRequiredBatteryCapacityAh(
          adjustedEnergy,
          validInput,
        );

      expect(result).toBeCloseTo(244.444, 2);
    });

    it("decreases required Ah as system voltage increases", () => {
      const adjustedEnergy =
        2.4 / 0.9 / 0.5 * 1.1;

      const result24V =
        calculateRequiredBatteryCapacityAh(
          adjustedEnergy,
          validInput,
        );

      const result48V =
        calculateRequiredBatteryCapacityAh(
          adjustedEnergy,
          {
            ...validInput,
            systemVoltageV: 48,
          },
        );

      expect(result48V).toBeLessThan(result24V);
    });
  });

  describe("calculateSeriesBatteries", () => {
    it("calculates an exact series count", () => {
      expect(
        calculateSeriesBatteries(24, 12),
      ).toBe(2);
    });

    it("rounds the series count upward", () => {
      expect(
        calculateSeriesBatteries(48, 12),
      ).toBe(4);

      expect(
        calculateSeriesBatteries(48, 15),
      ).toBe(4);
    });
  });

  describe("calculateParallelStrings", () => {
    it("calculates an exact parallel string count", () => {
      expect(
        calculateParallelStrings(400, 200),
      ).toBe(2);
    });

    it("rounds the parallel string count upward", () => {
      expect(
        calculateParallelStrings(401, 200),
      ).toBe(3);
    });
  });

  describe("calculateBatterySizing", () => {
    it("calculates the core battery sizing result", () => {
      const result =
        calculateBatterySizing(validInput);

      expect(
        result.requiredBatteryEnergyKWh,
      ).toBeCloseTo(2.4);

      expect(
        result.adjustedBatteryEnergyKWh,
      ).toBeCloseTo(
        (2.4 / 0.9 / 0.5) * 1.1,
      );

      expect(
        result.requiredBatteryCapacityAh,
      ).toBeCloseTo(244.444, 2);
    });

    it("does not create physical configuration without battery unit data", () => {
      const result =
        calculateBatterySizing(validInput);

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

    it("calculates the complete physical battery configuration", () => {
      const result =
        calculateBatterySizing({
          ...validInput,
          batteryUnitVoltageV: 12,
          batteryUnitCapacityAh: 200,
        });

      expect(result.batteryUnitVoltageV).toBe(12);
      expect(result.batteryUnitCapacityAh).toBe(200);

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

    it("preserves input values without mutation", () => {
      const input: BatterySizingInput = {
        ...validInput,
        batteryUnitVoltageV: 12,
        batteryUnitCapacityAh: 200,
      };

      const before = structuredClone(input);

      calculateBatterySizing(input);

      expect(input).toEqual(before);
    });
  });
});
