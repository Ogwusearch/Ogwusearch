import { describe, expect, it } from "vitest";

import {
  quantity,
  convert,
  convertValue,
} from "../index";

describe("engineering-units", () => {
  it("creates a quantity", () => {
    const energy = quantity(15, "kWh");

    expect(energy.value).toBe(15);
    expect(energy.unit).toBe("kWh");
    expect(energy.dimension).toBe("energy");
  });

  it("converts kWh to Wh", () => {
    const result = convertValue(
      15,
      "kWh",
      "Wh",
    );

    expect(result).toBe(15000);
  });

  it("converts kW to W", () => {
    const result = convertValue(
      5,
      "kW",
      "W",
    );

    expect(result).toBe(5000);
  });

  it("converts Ah to Coulombs", () => {
    const result = convertValue(
      10,
      "Ah",
      "C",
    );

    expect(result).toBe(36000);
  });

  it("rejects incompatible dimensions", () => {
    expect(() =>
      convert(
        quantity(15, "kWh"),
        "kW",
      ),
    ).toThrow();
  });

  it("converts Wh to kWh", () => {
    const result = convertValue(
      15000,
      "Wh",
      "kWh",
    );

    expect(result).toBe(15);
  });

  it("converts W to kW", () => {
    const result = convertValue(
      5000,
      "W",
      "kW",
    );

    expect(result).toBe(5);
  });

  it("preserves the dimension after conversion", () => {
    const result = convert(
      quantity(15, "kWh"),
      "Wh",
    );

    expect(result.dimension).toBe("energy");
    expect(result.unit).toBe("Wh");
    expect(result.value).toBe(15000);
  });

  it("rejects unknown units", () => {
    expect(() =>
      quantity(15, "invalid-unit"),
    ).toThrow();
  });
});