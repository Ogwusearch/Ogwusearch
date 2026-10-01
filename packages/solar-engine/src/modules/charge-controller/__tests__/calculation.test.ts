import {
  calculateChargeControllerSizing,
} from "../index.js";

import {
  describe,
  expect,
  it,
} from "vitest";

describe("charge controller sizing calculations", () => {
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

  describe("current calculations", () => {
    it("calculates PV charging current", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.pvChargingCurrentA,
      ).toBe(125);
    });

    it("calculates controller output current", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.controllerOutputCurrentA,
      ).toBeCloseTo(122.5, 5);
    });

    it("applies the safety margin to controller current", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.requiredControllerCurrentA,
      ).toBeCloseTo(153.125, 5);
    });

    it("calculates required controller power", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.requiredControllerPowerW,
      ).toBeCloseTo(7350, 5);
    });

    it("calculates controller current margin", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.controllerCurrentMarginA,
      ).toBeCloseTo(6.875, 5);
    });

    it("detects compatible controller current rating", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          controllerRatedCurrentA: 160,
        });

      expect(
        result.currentCompatible,
      ).toBe(true);
    });

    it("detects insufficient controller current rating", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          controllerRatedCurrentA: 150,
        });

      expect(
        result.currentCompatible,
      ).toBe(false);

      expect(
        result.controllerCurrentMarginA,
      ).toBeCloseTo(-3.125, 5);
    });
  });

  describe("voltage compatibility", () => {
    it("accepts PV Voc within the controller maximum", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.voltageCompatible,
      ).toBe(true);
    });

    it("rejects PV Voc above the controller maximum", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          pvArrayVocV: 160,
        });

      expect(
        result.voltageCompatible,
      ).toBe(false);
    });

    it("accepts PV Vmp inside the MPPT range", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.mpptCompatible,
      ).toBe(true);
    });

    it("rejects PV Vmp below the MPPT range", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          pvArrayVmpV: 50,
        });

      expect(
        result.mpptCompatible,
      ).toBe(false);
    });

    it("rejects PV Vmp above the MPPT range", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          pvArrayVmpV: 130,
        });

      expect(
        result.mpptCompatible,
      ).toBe(false);
    });
  });

  describe("PV current compatibility", () => {
    it("accepts PV current within controller limit", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.pvCurrentCompatible,
      ).toBe(true);

      expect(
        result.pvCurrentMarginA,
      ).toBe(5);
    });

    it("rejects PV current above controller limit", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          controllerMaxPVCurrentA: 60,
        });

      expect(
        result.pvCurrentCompatible,
      ).toBe(false);

      expect(
        result.pvCurrentMarginA,
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
        result.pvCurrentCompatible,
      ).toBe(false);
    });

    it("uses Imp when Isc is not supplied", () => {
      const {
        pvArrayIscA: _pvArrayIscA,
        ...inputWithoutIsc
      } = validInput;

      const result =
        calculateChargeControllerSizing({
          ...inputWithoutIsc,
          pvArrayImpA: 60,
          controllerMaxPVCurrentA: 60,
        });

      expect(
        result.pvCurrentCompatible,
      ).toBe(true);
    });
  });

  describe("overall compatibility", () => {
    it("returns true when all supplied compatibility checks pass", () => {
      const result =
        calculateChargeControllerSizing(
          validInput,
        );

      expect(
        result.systemCompatible,
      ).toBe(true);
    });

    it("returns false when one supplied compatibility check fails", () => {
      const result =
        calculateChargeControllerSizing({
          ...validInput,
          controllerRatedCurrentA: 150,
        });

      expect(
        result.systemCompatible,
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
        result.currentCompatible,
      ).toBeUndefined();

      expect(
        result.voltageCompatible,
      ).toBeUndefined();

      expect(
        result.mpptCompatible,
      ).toBeUndefined();

      expect(
        result.pvCurrentCompatible,
      ).toBeUndefined();

      expect(
        result.systemCompatible,
      ).toBeUndefined();
    });
  });
});
