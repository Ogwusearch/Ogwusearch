import { describe, expect, it } from "vitest";

import {
  calculateInverterSizing,
  calculateInverterSizingResult,
} from "../index";

import { validateInverterSizingInput } from "../validation";

describe("inverter sizing", () => {
  const validInput = {
    continuousLoadW: 2000,
    surgeLoadW: 4000,
    systemVoltageV: 48,
    inverterEfficiency: 0.9,
    powerFactor: 0.8,
  };

  describe("validation", () => {
    it("accepts valid input", () => {
      const errors =
        validateInverterSizingInput(validInput);

      expect(errors).toHaveLength(0);
    });

    it("rejects zero continuous load", () => {
      const errors = validateInverterSizingInput({
        ...validInput,
        continuousLoadW: 0,
      });

      expect(
        errors.some(
          (error) =>
            error.code === "INVALID_CONTINUOUS_LOAD"
        )
      ).toBe(true);
    });

    it("rejects zero surge load", () => {
      const errors = validateInverterSizingInput({
        ...validInput,
        surgeLoadW: 0,
      });

      expect(
        errors.some(
          (error) =>
            error.code === "INVALID_SURGE_LOAD"
        )
      ).toBe(true);
    });

    it("rejects surge load below continuous load", () => {
      const errors = validateInverterSizingInput({
        ...validInput,
        continuousLoadW: 3000,
        surgeLoadW: 2000,
      });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SURGE_LOAD_RELATIONSHIP"
        )
      ).toBe(true);
    });

    it("rejects invalid inverter efficiency", () => {
      const errors = validateInverterSizingInput({
        ...validInput,
        inverterEfficiency: 1.2,
      });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_INVERTER_EFFICIENCY"
        )
      ).toBe(true);
    });

    it("rejects invalid power factor", () => {
      const errors = validateInverterSizingInput({
        ...validInput,
        powerFactor: 0,
      });

      expect(
        errors.some(
          (error) =>
            error.code === "INVALID_POWER_FACTOR"
        )
      ).toBe(true);
    });
  });

  describe("calculation", () => {
    it("calculates continuous AC output requirement", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredContinuousOutputPowerW
      ).toBe(2000);
    });

    it("calculates surge AC output requirement", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredSurgeOutputPowerW
      ).toBe(4000);
    });

    it("calculates continuous DC input power", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredContinuousInputPowerW
      ).toBeCloseTo(2222.222222, 5);
    });

    it("calculates surge DC input power", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredSurgeInputPowerW
      ).toBeCloseTo(4444.444444, 5);
    });

    it("calculates continuous apparent power", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredContinuousVA
      ).toBe(2500);
    });

    it("calculates continuous DC input current", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredContinuousDCInputCurrentA
      ).toBeCloseTo(46.296296, 5);
    });

    it("calculates surge DC input current", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredSurgeDCInputCurrentA
      ).toBeCloseTo(92.592593, 5);
    });
  });

  describe("inverter compatibility", () => {
    it("detects compatible continuous inverter capacity", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 2500,
        });

      expect(result.continuousCompatible).toBe(
        true
      );

      expect(result.continuousMarginW).toBe(500);
    });

    it("detects insufficient continuous inverter capacity", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 1500,
        });

      expect(result.continuousCompatible).toBe(
        false
      );

      expect(result.continuousMarginW).toBe(-500);
    });

    it("detects compatible surge capacity", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterSurgePowerW: 5000,
        });

      expect(result.surgeCompatible).toBe(true);

      expect(result.surgeMarginW).toBe(1000);
    });

    it("detects insufficient surge capacity", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterSurgePowerW: 3000,
        });

      expect(result.surgeCompatible).toBe(false);

      expect(result.surgeMarginW).toBe(-1000);
    });

    it("validates DC input voltage compatibility", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterInputVoltageMinV: 40,
          inverterInputVoltageMaxV: 60,
        });

      expect(
        result.inputVoltageCompatible
      ).toBe(true);
    });

    it("rejects DC input voltage outside range", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterInputVoltageMinV: 60,
          inverterInputVoltageMaxV: 72,
        });

      expect(
        result.inputVoltageCompatible
      ).toBe(false);
    });

    it("validates AC output voltage compatibility", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          requiredOutputVoltageV: 230,
          inverterOutputVoltageV: 230,
        });

      expect(
        result.outputVoltageCompatible
      ).toBe(true);
    });

    it("detects AC output voltage mismatch", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          requiredOutputVoltageV: 230,
          inverterOutputVoltageV: 120,
        });

      expect(
        result.outputVoltageCompatible
      ).toBe(false);
    });

    it("calculates overall system compatibility", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 2500,
          inverterSurgePowerW: 5000,
          inverterInputVoltageMinV: 40,
          inverterInputVoltageMaxV: 60,
          requiredOutputVoltageV: 230,
          inverterOutputVoltageV: 230,
        });

      expect(result.systemCompatible).toBe(true);
    });

    it("detects overall system incompatibility", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 1500,
          inverterSurgePowerW: 5000,
          inverterInputVoltageMinV: 40,
          inverterInputVoltageMaxV: 60,
          requiredOutputVoltageV: 230,
          inverterOutputVoltageV: 230,
        });

      expect(result.systemCompatible).toBe(
        false
      );
    });
  });

  describe("result pipeline", () => {
    it("returns a successful engineering result", () => {
      const result =
        calculateInverterSizingResult({
          ...validInput,
          inverterRatedPowerW: 2500,
          inverterSurgePowerW: 5000,
        });

      expect(result.success).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(result.trace).toBeDefined();
      expect(result.metadata.engine).toBe(
        "inverter-sizing"
      );
    });

    it("returns validation errors without calculating", () => {
      const result =
        calculateInverterSizingResult({
          ...validInput,
          systemVoltageV: 0,
        });

      expect(result.success).toBe(false);
      expect(result.value).toBeUndefined();
      expect(result.trace).toBeUndefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings).toHaveLength(0);
    });

    it("includes a calculation trace", () => {
      const result =
        calculateInverterSizingResult(validInput);

      expect(result.trace).toBeDefined();

      expect(
        result.trace?.formulas
          .requiredContinuousOutputPowerW
      ).toContain("continuousLoadW");

      expect(
        result.trace?.formulas
          .requiredContinuousInputPowerW
      ).toContain("inverterEfficiency");

      expect(
        result.trace?.assumptions.length
      ).toBeGreaterThan(0);
    });
  });
});