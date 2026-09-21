import { describe, expect, it } from "vitest";

import {
  calculateBatterySizing,
} from "../calculations";

import {
  validateBatterySizingInput,
} from "../validation";

import type {
  BatterySizingInput,
} from "../types";

describe("battery sizing", () => {
  const validInput: BatterySizingInput = {
    dailyEnergyKWh: 2.4,
    autonomyDays: 1,
    systemVoltageV: 24,
    depthOfDischarge: 0.5,
    batteryEfficiency: 0.9,
    designMargin: 0.1,
  };

  describe("validation", () => {
    it("accepts valid battery input", () => {
      const errors =
        validateBatterySizingInput(validInput);

      expect(errors).toEqual([]);
    });

    it("rejects zero daily energy", () => {
      const errors =
        validateBatterySizingInput({
          ...validInput,
          dailyEnergyKWh: 0,
        });

      expect(errors.length).toBeGreaterThan(0);
    });

    it("rejects invalid system voltage", () => {
      const errors =
        validateBatterySizingInput({
          ...validInput,
          systemVoltageV: 0,
        });

      expect(errors.length).toBeGreaterThan(0);
    });

    it("rejects invalid depth of discharge", () => {
      const errors =
        validateBatterySizingInput({
          ...validInput,
          depthOfDischarge: 1.2,
        });

      expect(errors.length).toBeGreaterThan(0);
    });

    it("rejects invalid battery efficiency", () => {
      const errors =
        validateBatterySizingInput({
          ...validInput,
          batteryEfficiency: 0,
        });

      expect(errors.length).toBeGreaterThan(0);
    });

    it("rejects negative design margin", () => {
      const errors =
        validateBatterySizingInput({
          ...validInput,
          designMargin: -0.1,
        });

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("calculation", () => {
    it("calculates battery sizing for valid input", () => {
      const result =
        calculateBatterySizing(validInput);

      expect(result).toBeDefined();

      expect(
        result.requiredBatteryEnergyKWh,
      ).toBeCloseTo(2.4);

      expect(
        result.adjustedBatteryEnergyKWh,
      ).toBeGreaterThan(2.4);

      expect(
        result.requiredBatteryCapacityAh,
      ).toBeGreaterThan(0);
    });

    it("calculates the expected battery capacity", () => {
      const result =
        calculateBatterySizing(validInput);

      expect(
        result.requiredBatteryCapacityAh,
      ).toBeCloseTo(244.444, 2);
    });

    it("increases required capacity when design margin increases", () => {
      const normal =
        calculateBatterySizing(validInput);

      const largerMargin =
        calculateBatterySizing({
          ...validInput,
          designMargin: 0.25,
        });

      expect(
        largerMargin.requiredBatteryCapacityAh,
      ).toBeGreaterThan(
        normal.requiredBatteryCapacityAh,
      );
    });

    it("increases required capacity when depth of discharge decreases", () => {
      const normal =
        calculateBatterySizing(validInput);

      const lowerDoD =
        calculateBatterySizing({
          ...validInput,
          depthOfDischarge: 0.4,
        });

      expect(
        lowerDoD.requiredBatteryCapacityAh,
      ).toBeGreaterThan(
        normal.requiredBatteryCapacityAh,
      );
    });

    it("calculates physical battery configuration", () => {
      const result =
        calculateBatterySizing({
          ...validInput,
          batteryUnitVoltageV: 12,
          batteryUnitCapacityAh: 200,
        });

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
});