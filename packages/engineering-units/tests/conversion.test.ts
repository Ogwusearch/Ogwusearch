import { describe, expect, it } from "vitest";

import {
  convert,
  convertTo,
  createQuantity,
  quantitiesEqual,
  compareQuantities,
  IncompatibleUnitError,
  VOLT,
  MILLIVOLT,
  KILOVOLT,
  WATT,
  KILOWATT,
  WATT_HOUR,
  KILOWATT_HOUR,
  JOULE,
  KELVIN,
  CELSIUS,
  FAHRENHEIT,
  AMPERE_HOUR,
  MILLIAMPERE_HOUR,
} from "../src/index.js";

describe("@ogwusearch/engineering-units — conversion", () => {
  describe("voltage", () => {
    it("converts volts to kilovolts", () => {
      expect(
        convert(1000, VOLT, KILOVOLT),
      ).toBeCloseTo(1, 12);
    });

    it("converts kilovolts to volts", () => {
      expect(
        convert(2.5, KILOVOLT, VOLT),
      ).toBeCloseTo(2500, 12);
    });

    it("converts millivolts to volts", () => {
      expect(
        convert(500, MILLIVOLT, VOLT),
      ).toBeCloseTo(0.5, 12);
    });

    it("supports voltage round trips", () => {
      const original = 230;

      const kilovolts = convert(
        original,
        VOLT,
        KILOVOLT,
      );

      const volts = convert(
        kilovolts,
        KILOVOLT,
        VOLT,
      );

      expect(volts).toBeCloseTo(original, 12);
    });
  });

  describe("power", () => {
    it("converts watts to kilowatts", () => {
      expect(
        convert(5000, WATT, KILOWATT),
      ).toBeCloseTo(5, 12);
    });

    it("converts kilowatts to watts", () => {
      expect(
        convert(3.5, KILOWATT, WATT),
      ).toBeCloseTo(3500, 12);
    });

    it("supports power round trips", () => {
      const original = 7500;

      const kilowatts = convert(
        original,
        WATT,
        KILOWATT,
      );

      const watts = convert(
        kilowatts,
        KILOWATT,
        WATT,
      );

      expect(watts).toBeCloseTo(original, 12);
    });
  });

  describe("energy", () => {
    it("converts joules to watt-hours", () => {
      expect(
        convert(3600, JOULE, WATT_HOUR),
      ).toBeCloseTo(1, 12);
    });

    it("converts watt-hours to kilowatt-hours", () => {
      expect(
        convert(5000, WATT_HOUR, KILOWATT_HOUR),
      ).toBeCloseTo(5, 12);
    });

    it("converts kilowatt-hours to watt-hours", () => {
      expect(
        convert(2.5, KILOWATT_HOUR, WATT_HOUR),
      ).toBeCloseTo(2500, 12);
    });

    it("supports energy round trips", () => {
      const original = 1250;

      const kWh = convert(
        original,
        WATT_HOUR,
        KILOWATT_HOUR,
      );

      const wattHours = convert(
        kWh,
        KILOWATT_HOUR,
        WATT_HOUR,
      );

      expect(wattHours).toBeCloseTo(original, 12);
    });
  });

  describe("charge", () => {
    it("converts ampere-hours to milliampere-hours", () => {
      expect(
        convert(
          2,
          AMPERE_HOUR,
          MILLIAMPERE_HOUR,
        ),
      ).toBeCloseTo(2000, 12);
    });

    it("converts milliampere-hours to ampere-hours", () => {
      expect(
        convert(
          3500,
          MILLIAMPERE_HOUR,
          AMPERE_HOUR,
        ),
      ).toBeCloseTo(3.5, 12);
    });
  });

  describe("temperature", () => {
    it("converts Celsius to Kelvin", () => {
      expect(
        convert(0, CELSIUS, KELVIN),
      ).toBeCloseTo(273.15, 12);
    });

    it("converts Kelvin to Celsius", () => {
      expect(
        convert(273.15, KELVIN, CELSIUS),
      ).toBeCloseTo(0, 12);
    });

    it("converts Celsius to Fahrenheit", () => {
      expect(
        convert(100, CELSIUS, FAHRENHEIT),
      ).toBeCloseTo(212, 12);
    });

    it("converts Fahrenheit to Celsius", () => {
      expect(
        convert(32, FAHRENHEIT, CELSIUS),
      ).toBeCloseTo(0, 12);
    });

    it("supports temperature round trips", () => {
      const original = 25;

      const fahrenheit = convert(
        original,
        CELSIUS,
        FAHRENHEIT,
      );

      const celsius = convert(
        fahrenheit,
        FAHRENHEIT,
        CELSIUS,
      );

      expect(celsius).toBeCloseTo(original, 12);
    });
  });

  describe("dimension safety", () => {
    it("rejects conversion between incompatible dimensions", () => {
      expect(() =>
        convert(230, VOLT, WATT),
      ).toThrow(IncompatibleUnitError);
    });

    it("rejects incompatible quantity conversion", () => {
      const voltage = createQuantity(
        230,
        VOLT,
      );

      expect(() =>
        convertTo(voltage, WATT),
      ).toThrow(IncompatibleUnitError);
    });
  });

  describe("quantity conversion", () => {
    it("preserves the target unit", () => {
      const voltage = createQuantity(
        230,
        VOLT,
      );

      const kilovolts = convertTo(
        voltage,
        KILOVOLT,
      );

      expect(kilovolts.value).toBeCloseTo(
        0.23,
        12,
      );

      expect(kilovolts.unit).toBe(
        KILOVOLT,
      );
    });
  });

  describe("quantity comparison", () => {
    it("compares equivalent quantities across units", () => {
      const a = createQuantity(
        1000,
        WATT,
      );

      const b = createQuantity(
        1,
        KILOWATT,
      );

      expect(
        compareQuantities(a, b),
      ).toBe(0);

      expect(
        quantitiesEqual(a, b),
      ).toBe(true);
    });

    it("orders quantities using their base representation", () => {
      const a = createQuantity(
        500,
        WATT,
      );

      const b = createQuantity(
        1,
        KILOWATT,
      );

      expect(
        compareQuantities(a, b),
      ).toBe(-1);

      expect(
        compareQuantities(b, a),
      ).toBe(1);
    });
  });

  describe("invalid numeric input", () => {
    it("rejects NaN during conversion", () => {
      expect(() =>
        convert(NaN, VOLT, KILOVOLT),
      ).toThrow();
    });

    it("rejects Infinity during conversion", () => {
      expect(() =>
        convert(Infinity, VOLT, KILOVOLT),
      ).toThrow();
    });

    it("rejects non-finite quantity values", () => {
      expect(() =>
        createQuantity(Infinity, VOLT),
      ).toThrow();
    });
  });
});