import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateInverterSizing,
  runInverterSizing,
} from "../index";

describe("inverter sizing regressions", () => {
  describe("legacy calculation behavior", () => {
    it("preserves the existing continuous output calculation", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
      });

      expect(
        result.requiredContinuousOutputPowerW,
      ).toBe(2000);
    });

    it("preserves the existing surge output calculation", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
      });

      expect(
        result.requiredSurgeOutputPowerW,
      ).toBe(4000);
    });

    it("preserves the existing DC input power calculation", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
      });

      expect(
        result.requiredContinuousInputPowerW,
      ).toBeCloseTo(2222.222222, 5);

      expect(
        result.requiredSurgeInputPowerW,
      ).toBeCloseTo(4444.444444, 5);
    });

    it("preserves the existing DC input current calculation", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
      });

      expect(
        result.requiredContinuousDCInputCurrentA,
      ).toBeCloseTo(46.296296, 5);

      expect(
        result.requiredSurgeDCInputCurrentA,
      ).toBeCloseTo(92.592593, 5);
    });

    it("preserves apparent power behavior when power factor is supplied", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        powerFactor: 0.8,
      });

      expect(
        result.requiredContinuousVA,
      ).toBe(2500);
    });

    it("preserves optional apparent power behavior", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
      });

      expect(
        result.requiredContinuousVA,
      ).toBeUndefined();
    });
  });

  describe("capacity compatibility regressions", () => {
    it("preserves continuous inverter margin behavior", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterRatedPowerW: 2500,
      });

      expect(
        result.continuousMarginW,
      ).toBe(500);

      expect(
        result.continuousCompatible,
      ).toBe(true);
    });

    it("preserves insufficient continuous capacity behavior", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterRatedPowerW: 1500,
      });

      expect(
        result.continuousMarginW,
      ).toBe(-500);

      expect(
        result.continuousCompatible,
      ).toBe(false);
    });

    it("preserves surge inverter margin behavior", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterSurgePowerW: 5000,
      });

      expect(
        result.surgeMarginW,
      ).toBe(1000);

      expect(
        result.surgeCompatible,
      ).toBe(true);
    });

    it("preserves insufficient surge capacity behavior", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterSurgePowerW: 3000,
      });

      expect(
        result.surgeMarginW,
      ).toBe(-1000);

      expect(
        result.surgeCompatible,
      ).toBe(false);
    });
  });

  describe("voltage compatibility regressions", () => {
    it("preserves DC input voltage range behavior", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterInputVoltageMinV: 40,
        inverterInputVoltageMaxV: 60,
      });

      expect(
        result.inputVoltageCompatible,
      ).toBe(true);
    });

    it("preserves DC input voltage mismatch behavior", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterInputVoltageMinV: 60,
        inverterInputVoltageMaxV: 72,
      });

      expect(
        result.inputVoltageCompatible,
      ).toBe(false);
    });

    it("preserves exact AC output voltage matching", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        requiredOutputVoltageV: 230,
        inverterOutputVoltageV: 230,
      });

      expect(
        result.outputVoltageCompatible,
      ).toBe(true);
    });

    it("preserves AC output voltage mismatch behavior", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        requiredOutputVoltageV: 230,
        inverterOutputVoltageV: 120,
      });

      expect(
        result.outputVoltageCompatible,
      ).toBe(false);
    });
  });

  describe("system compatibility regressions", () => {
    it("preserves the all-checks-compatible result", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterRatedPowerW: 2500,
        inverterSurgePowerW: 5000,
        inverterInputVoltageMinV: 40,
        inverterInputVoltageMaxV: 60,
        requiredOutputVoltageV: 230,
        inverterOutputVoltageV: 230,
      });

      expect(
        result.systemCompatible,
      ).toBe(true);
    });

    it("preserves failure when one supplied compatibility check fails", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterRatedPowerW: 1500,
        inverterSurgePowerW: 5000,
        inverterInputVoltageMinV: 40,
        inverterInputVoltageMaxV: 60,
        requiredOutputVoltageV: 230,
        inverterOutputVoltageV: 230,
      });

      expect(
        result.systemCompatible,
      ).toBe(false);
    });

    it("preserves undefined system compatibility when no compatibility checks are supplied", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
      });

      expect(
        result.systemCompatible,
      ).toBeUndefined();
    });

    it("preserves partial compatibility evaluation", () => {
      const result = calculateInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        inverterRatedPowerW: 2500,
      });

      expect(
        result.continuousCompatible,
      ).toBe(true);

      expect(
        result.surgeCompatible,
      ).toBeUndefined();

      expect(
        result.inputVoltageCompatible,
      ).toBeUndefined();

      expect(
        result.outputVoltageCompatible,
      ).toBeUndefined();

      expect(
        result.systemCompatible,
      ).toBe(true);
    });
  });

  describe("result pipeline regressions", () => {
    it("preserves successful result structure", () => {
      const result = runInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        powerFactor: 0.8,
      });

      expect(result.success).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.errors).toEqual([]);
      expect(result.trace).toBeDefined();

      expect(
        result.metadata.engine,
      ).toBe("inverter-sizing");

      expect(
        result.metadata.unitSystem,
      ).toBe("SI");
    });

    it("preserves validation short-circuit behavior", () => {
      const result = runInverterSizing({
        continuousLoadW: 0,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
      });

      expect(result.success).toBe(false);
      expect(result.value).toBeUndefined();
      expect(result.trace).toBeUndefined();
      expect(result.warnings).toEqual([]);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("preserves calculation values through the public run pipeline", () => {
      const result = runInverterSizing({
        continuousLoadW: 2000,
        surgeLoadW: 4000,
        systemVoltageV: 48,
        inverterEfficiency: 0.9,
        powerFactor: 0.8,
      });

      expect(
        result.value?.requiredContinuousOutputPowerW,
      ).toBe(2000);

      expect(
        result.value?.requiredSurgeOutputPowerW,
      ).toBe(4000);

      expect(
        result.value?.requiredContinuousInputPowerW,
      ).toBeCloseTo(2222.222222, 5);

      expect(
        result.value?.requiredSurgeInputPowerW,
      ).toBeCloseTo(4444.444444, 5);
    });
  });
});