
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateInverterSizing,
} from "../calculation";

describe("inverter sizing calculations", () => {
  const validInput = {
    continuousLoadW: 2000,
    surgeLoadW: 4000,
    systemVoltageV: 48,
    inverterEfficiency: 0.9,
    powerFactor: 0.8,
  };

  describe("AC output", () => {
    it("calculates continuous AC output requirement", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredContinuousOutputPowerW,
      ).toBe(2000);
    });

    it("calculates surge AC output requirement", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredSurgeOutputPowerW,
      ).toBe(4000);
    });

    it("calculates continuous apparent power", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredContinuousVA,
      ).toBe(2500);
    });

    it("omits apparent power when power factor is not supplied", () => {
      const result =
        calculateInverterSizing({
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

  describe("DC input", () => {
    it("calculates continuous DC input power", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredContinuousInputPowerW,
      ).toBeCloseTo(2222.222222, 5);
    });

    it("calculates surge DC input power", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredSurgeInputPowerW,
      ).toBeCloseTo(4444.444444, 5);
    });

    it("calculates continuous DC input current", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredContinuousDCInputCurrentA,
      ).toBeCloseTo(46.296296, 5);
    });

    it("calculates surge DC input current", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.requiredSurgeDCInputCurrentA,
      ).toBeCloseTo(92.592593, 5);
    });
  });

  describe("inverter capacity", () => {
    it("detects compatible continuous inverter capacity", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 2500,
        });

      expect(
        result.inverterRatedPowerW,
      ).toBe(2500);

      expect(
        result.continuousMarginW,
      ).toBe(500);

      expect(
        result.continuousCompatible,
      ).toBe(true);
    });

    it("detects insufficient continuous inverter capacity", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 1500,
        });

      expect(
        result.inverterRatedPowerW,
      ).toBe(1500);

      expect(
        result.continuousMarginW,
      ).toBe(-500);

      expect(
        result.continuousCompatible,
      ).toBe(false);
    });

    it("detects compatible surge capacity", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterSurgePowerW: 5000,
        });

      expect(
        result.inverterSurgePowerW,
      ).toBe(5000);

      expect(
        result.surgeMarginW,
      ).toBe(1000);

      expect(
        result.surgeCompatible,
      ).toBe(true);
    });

    it("detects insufficient surge capacity", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterSurgePowerW: 3000,
        });

      expect(
        result.inverterSurgePowerW,
      ).toBe(3000);

      expect(
        result.surgeMarginW,
      ).toBe(-1000);

      expect(
        result.surgeCompatible,
      ).toBe(false);
    });

    it("omits continuous capacity checks when no continuous rating is supplied", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.inverterRatedPowerW,
      ).toBeUndefined();

      expect(
        result.continuousMarginW,
      ).toBeUndefined();

      expect(
        result.continuousCompatible,
      ).toBeUndefined();
    });

    it("omits surge capacity checks when no surge rating is supplied", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.inverterSurgePowerW,
      ).toBeUndefined();

      expect(
        result.surgeMarginW,
      ).toBeUndefined();

      expect(
        result.surgeCompatible,
      ).toBeUndefined();
    });
  });

  describe("DC input voltage compatibility", () => {
    it("accepts system voltage within the inverter input range", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterInputVoltageMinV: 40,
          inverterInputVoltageMaxV: 60,
        });

      expect(
        result.inputVoltageCompatible,
      ).toBe(true);
    });

    it("rejects system voltage below the inverter input range", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterInputVoltageMinV: 60,
          inverterInputVoltageMaxV: 72,
        });

      expect(
        result.inputVoltageCompatible,
      ).toBe(false);
    });

    it("rejects system voltage above the inverter input range", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          systemVoltageV: 72,
          inverterInputVoltageMinV: 40,
          inverterInputVoltageMaxV: 60,
        });

      expect(
        result.inputVoltageCompatible,
      ).toBe(false);
    });

    it("omits input voltage compatibility when the voltage range is not supplied", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.inputVoltageCompatible,
      ).toBeUndefined();
    });
  });

  describe("AC output voltage compatibility", () => {
    it("accepts matching required and inverter output voltages", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          requiredOutputVoltageV: 230,
          inverterOutputVoltageV: 230,
        });

      expect(
        result.outputVoltageCompatible,
      ).toBe(true);
    });

    it("detects an AC output voltage mismatch", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          requiredOutputVoltageV: 230,
          inverterOutputVoltageV: 120,
        });

      expect(
        result.outputVoltageCompatible,
      ).toBe(false);
    });

    it("omits output voltage compatibility when both voltages are not supplied", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.outputVoltageCompatible,
      ).toBeUndefined();
    });
  });

  describe("overall system compatibility", () => {
    it("returns true when all supplied compatibility checks pass", () => {
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

      expect(
        result.systemCompatible,
      ).toBe(true);
    });

    it("returns false when a supplied compatibility check fails", () => {
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

      expect(
        result.systemCompatible,
      ).toBe(false);
    });

    it("returns false when the supplied surge capacity check fails", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 2500,
          inverterSurgePowerW: 3000,
        });

      expect(
        result.systemCompatible,
      ).toBe(false);
    });

    it("returns false when the supplied input voltage check fails", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 2500,
          inverterInputVoltageMinV: 60,
          inverterInputVoltageMaxV: 72,
        });

      expect(
        result.systemCompatible,
      ).toBe(false);
    });

    it("returns false when the supplied output voltage check fails", () => {
      const result =
        calculateInverterSizing({
          ...validInput,
          inverterRatedPowerW: 2500,
          requiredOutputVoltageV: 230,
          inverterOutputVoltageV: 120,
        });

      expect(
        result.systemCompatible,
      ).toBe(false);
    });

    it("leaves system compatibility undefined when no compatibility checks are supplied", () => {
      const result =
        calculateInverterSizing(validInput);

      expect(
        result.systemCompatible,
      ).toBeUndefined();
    });
  });
});