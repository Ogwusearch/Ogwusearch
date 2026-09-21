

import { describe, expect, it } from "vitest";

import {
  calculateChargeControllerSizing,
  calculateChargeControllerSizingResult,
} from "../index";

import { validateChargeControllerSizingInput } from "../validation";

import { generateChargeControllerSizingWarnings } from "../warnings";

describe("charge controller sizing", () => {
  const validInput = {
    pvArrayPowerW: 6000,
    batteryVoltageV: 48,
    controllerEfficiency: 0.98,
    safetyMargin: 0.25,

    pvArrayVmpV: 100,
    pvArrayVocV: 120,
    pvArrayImpA: 60,
    pvArrayIscA: 65,

    controllerRatedCurrentA: 160,
    controllerMaxPVVoltageV: 150,
    controllerMPPTMinVoltageV: 60,
    controllerMPPTMaxVoltageV: 120,
    controllerMaxPVCurrentA: 70,
  };

  describe("validation", () => {
    it("accepts valid input", () => {
      const errors =
        validateChargeControllerSizingInput(
          validInput
        );

      expect(errors).toHaveLength(0);
    });

    it("rejects zero PV array power", () => {
      const errors =
        validateChargeControllerSizingInput({
          ...validInput,
          pvArrayPowerW: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code === "INVALID_PV_ARRAY_POWER"
        )
      ).toBe(true);
    });

    it("rejects zero battery voltage", () => {
      const errors =
        validateChargeControllerSizingInput({
          ...validInput,
          batteryVoltageV: 0,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_BATTERY_VOLTAGE"
        )
      ).toBe(true);
    });

    it("rejects invalid controller efficiency", () => {
      const errors =
        validateChargeControllerSizingInput({
          ...validInput,
          controllerEfficiency: 1.1,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_CONTROLLER_EFFICIENCY"
        )
      ).toBe(true);
    });

    it("rejects negative safety margin", () => {
      const errors =
        validateChargeControllerSizingInput({
          ...validInput,
          safetyMargin: -0.1,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_SAFETY_MARGIN"
        )
      ).toBe(true);
    });

    it("rejects Vmp greater than Voc", () => {
      const errors =
        validateChargeControllerSizingInput({
          ...validInput,
          pvArrayVmpV: 130,
          pvArrayVocV: 120,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_PV_VOLTAGE_RELATIONSHIP"
        )
      ).toBe(true);
    });

    it("rejects Imp greater than Isc", () => {
      const errors =
        validateChargeControllerSizingInput({
          ...validInput,
          pvArrayImpA: 70,
          pvArrayIscA: 65,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_PV_CURRENT_RELATIONSHIP"
        )
      ).toBe(true);
    });

    it("rejects invalid MPPT voltage range", () => {
      const errors =
        validateChargeControllerSizingInput({
          ...validInput,
          controllerMPPTMinVoltageV: 130,
          controllerMPPTMaxVoltageV: 120,
        });

      expect(
        errors.some(
          (error) =>
            error.code ===
            "INVALID_MPPT_VOLTAGE_RANGE"
        )
      ).toBe(true);
    });
  });

  describe("calculation", () => {
    it("calculates PV charging current", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.pvChargingCurrentA
      ).toBe(125);
    });

    it("calculates controller output current", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.controllerOutputCurrentA
      ).toBeCloseTo(122.5, 5);
    });

    it("applies the safety margin to controller current", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.requiredControllerCurrentA
      ).toBeCloseTo(153.125, 5);
    });

    it("calculates required controller power", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.requiredControllerPowerW
      ).toBeCloseTo(7350, 5);
    });

    it("calculates controller current margin", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.controllerCurrentMarginA
      ).toBeCloseTo(6.875, 5);
    });

    it("detects compatible controller current rating", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          controllerRatedCurrentA: 160,
        });

      expect(
        result.currentCompatible
      ).toBe(true);
    });

    it("detects insufficient controller current rating", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          controllerRatedCurrentA: 150,
        });

      expect(
        result.currentCompatible
      ).toBe(false);

      expect(
        result.controllerCurrentMarginA
      ).toBeCloseTo(-3.125, 5);
    });
  });

  describe("voltage compatibility", () => {
    it("accepts PV Voc within the controller maximum", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.voltageCompatible
      ).toBe(true);
    });

    it("rejects PV Voc above the controller maximum", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          pvArrayVocV: 160,
        });

      expect(
        result.voltageCompatible
      ).toBe(false);
    });

    it("accepts PV Vmp inside the MPPT range", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.mpptCompatible
      ).toBe(true);
    });

    it("rejects PV Vmp below the MPPT range", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          pvArrayVmpV: 50,
        });

      expect(
        result.mpptCompatible
      ).toBe(false);
    });

    it("rejects PV Vmp above the MPPT range", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          pvArrayVmpV: 130,
        });

      expect(
        result.mpptCompatible
      ).toBe(false);
    });
  });

  describe("PV current compatibility", () => {
    it("accepts PV current within controller limit", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.pvCurrentCompatible
      ).toBe(true);

      expect(
        result.pvCurrentMarginA
      ).toBe(5);
    });

    it("rejects PV current above controller limit", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          controllerMaxPVCurrentA: 60,
        });

      expect(
        result.pvCurrentCompatible
      ).toBe(false);

      expect(
        result.pvCurrentMarginA
      ).toBe(-5);
    });

    it("prefers Isc for PV current compatibility", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          pvArrayImpA: 50,
          pvArrayIscA: 65,
          controllerMaxPVCurrentA: 60,
        });

      expect(
        result.pvCurrentCompatible
      ).toBe(false);
    });

    it("uses Imp when Isc is not supplied", () => {
      const result =
        calculateChargeControllerSizing({
          ...(({ pvArrayIscA: _pvArrayIscA, ...inputWithoutIsc }) =>
            inputWithoutIsc)(validInput),
          pvArrayImpA: 60,
          controllerMaxPVCurrentA: 60,
        });

      expect(
        result.pvCurrentCompatible
      ).toBe(true);
    });
  });

  describe("overall compatibility", () => {
    it("returns true when all supplied compatibility checks pass", () => {
      const result =
        calculateChargeControllerSizing(
          validInput
        );

      expect(
        result.systemCompatible
      ).toBe(true);
    });

    it("returns false when one supplied compatibility check fails", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          controllerRatedCurrentA: 150,
        });

      expect(
        result.systemCompatible
      ).toBe(false);
    });

    it("does not require optional compatibility inputs", () => {
      const result =
        calculateChargeControllerSizing({
          pvArrayPowerW: 3000,
          batteryVoltageV: 24,
          controllerEfficiency: 0.98,
          safetyMargin: 0.2,
        });

      expect(
        result.currentCompatible
      ).toBeUndefined();

      expect(
        result.voltageCompatible
      ).toBeUndefined();

      expect(
        result.mpptCompatible
      ).toBeUndefined();

      expect(
        result.pvCurrentCompatible
      ).toBeUndefined();

      expect(
        result.systemCompatible
      ).toBeUndefined();
    });
  });

  describe("warnings", () => {
    it("warns when controller efficiency is below 90%", () => {
      const input = {
        ...validInput,
        controllerEfficiency: 0.85,
      };

      const value =
        calculateChargeControllerSizing(
          input
        );

      const warnings =
        generateChargeControllerSizingWarnings(
          input,
          value
        );

      expect(
        warnings.some(
          (warning) =>
            warning.code ===
            "LOW_CONTROLLER_EFFICIENCY"
        )
      ).toBe(true);
    });

    it("warns when no safety margin is applied", () => {
      const input = {
        ...validInput,
        safetyMargin: 0,
      };

      const value =
        calculateChargeControllerSizing(
          input
        );

      const warnings =
        generateChargeControllerSizingWarnings(
          input,
          value
        );

      expect(
        warnings.some(
          (warning) =>
            warning.code ===
            "NO_SAFETY_MARGIN"
        )
      ).toBe(true);
    });

    it("warns when PV voltage exceeds controller limit", () => {
      const input = {
        ...validInput,
        pvArrayVocV: 160,
      };

      const value =
        calculateChargeControllerSizing(
          input
        );

      const warnings =
        generateChargeControllerSizingWarnings(
          input,
          value
        );

      expect(
        warnings.some(
          (warning) =>
            warning.code ===
            "PV_VOLTAGE_EXCEEDS_CONTROLLER_LIMIT"
        )
      ).toBe(true);
    });

    it("warns when MPPT voltage is outside the controller range", () => {
      const input = {
        ...validInput,
        pvArrayVmpV: 50,
      };

      const value =
        calculateChargeControllerSizing(
          input
        );

      const warnings =
        generateChargeControllerSizingWarnings(
          input,
          value
        );

      expect(
        warnings.some(
          (warning) =>
            warning.code ===
            "PV_VOLTAGE_OUTSIDE_MPPT_RANGE"
        )
      ).toBe(true);
    });

    it("warns when PV current exceeds controller limit", () => {
      const input = {
        ...validInput,
        controllerMaxPVCurrentA: 60,
      };

      const value =
        calculateChargeControllerSizing(
          input
        );

      const warnings =
        generateChargeControllerSizingWarnings(
          input,
          value
        );

      expect(
        warnings.some(
          (warning) =>
            warning.code ===
            "PV_CURRENT_EXCEEDS_CONTROLLER_LIMIT"
        )
      ).toBe(true);
    });
  });

  describe("result pipeline", () => {
    it("returns a successful engineering result", () => {
      const result =
        calculateChargeControllerSizingResult(
          validInput
        );

      expect(result.success).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(result.trace).toBeDefined();

      expect(result.metadata.engine).toBe(
        "charge-controller-sizing"
      );

      expect(result.metadata.unitSystem).toBe(
        "SI"
      );
    });

    it("returns validation errors without calculating", () => {
      const result =
        calculateChargeControllerSizingResult({
          ...validInput,
          batteryVoltageV: 0,
        });

      expect(result.success).toBe(false);
      expect(result.value).toBeUndefined();
      expect(result.trace).toBeUndefined();
      expect(result.errors.length).toBeGreaterThan(
        0
      );
      expect(result.warnings).toHaveLength(0);
    });

    it("includes the engineering calculation trace", () => {
      const result =
        calculateChargeControllerSizingResult(
          validInput
        );

      expect(result.trace).toBeDefined();

      expect(
        result.trace?.formulas
          .pvChargingCurrentA
      ).toContain("pvArrayPowerW");

      expect(
        result.trace?.formulas
          .requiredControllerCurrentA
      ).toContain("safetyMargin");

      expect(
        result.trace?.formulas
          .mpptCompatible
      ).toContain("pvArrayVmpV");

      expect(
        result.trace?.assumptions.length
      ).toBeGreaterThan(0);
    });

    it("returns warnings without failing a valid calculation", () => {
      const result =
        calculateChargeControllerSizingResult({
          ...validInput,
          safetyMargin: 0,
          controllerEfficiency: 0.85,
        });

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(
        result.warnings.length
      ).toBeGreaterThan(0);
    });
  });
});