import { describe, expect, it } from "vitest";

import { PV_SIZING_ERROR_CODES } from "../errors";
import { validatePVSizingInput } from "../validation";
import { PV_SIZING_WARNING_CODES } from "../warnings";

describe("validatePVSizingInput", () => {
  const validInput = {
    dailyEnergyKWh: 10,
    peakSunHours: 5,
    systemEfficiency: 0.8,
    panelPowerW: 550,
  };

  it("accepts valid PV sizing input", () => {
    const result = validatePVSizingInput(validInput);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it("rejects non-finite daily energy", () => {
    const result = validatePVSizingInput({
      ...validInput,
      dailyEnergyKWh: Number.NaN,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_DAILY_ENERGY,
        field: "dailyEnergyKWh",
        severity: "error",
      }),
    );
  });

  it("rejects zero daily energy", () => {
    const result = validatePVSizingInput({
      ...validInput,
      dailyEnergyKWh: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_DAILY_ENERGY,
      }),
    );
  });

  it("rejects negative daily energy", () => {
    const result = validatePVSizingInput({
      ...validInput,
      dailyEnergyKWh: -5,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_DAILY_ENERGY,
      }),
    );
  });

  it("rejects non-finite peak sun hours", () => {
    const result = validatePVSizingInput({
      ...validInput,
      peakSunHours: Number.POSITIVE_INFINITY,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_PEAK_SUN_HOURS,
        field: "peakSunHours",
        severity: "error",
      }),
    );
  });

  it("rejects zero peak sun hours", () => {
    const result = validatePVSizingInput({
      ...validInput,
      peakSunHours: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_PEAK_SUN_HOURS,
      }),
    );
  });

  it("rejects negative peak sun hours", () => {
    const result = validatePVSizingInput({
      ...validInput,
      peakSunHours: -1,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_PEAK_SUN_HOURS,
      }),
    );
  });

  it("rejects system efficiency below zero", () => {
    const result = validatePVSizingInput({
      ...validInput,
      systemEfficiency: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_SYSTEM_EFFICIENCY,
        field: "systemEfficiency",
        severity: "error",
      }),
    );
  });

  it("rejects system efficiency above one", () => {
    const result = validatePVSizingInput({
      ...validInput,
      systemEfficiency: 1.01,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_SYSTEM_EFFICIENCY,
      }),
    );
  });

  it("accepts system efficiency equal to one", () => {
    const result = validatePVSizingInput({
      ...validInput,
      systemEfficiency: 1,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects non-finite system efficiency", () => {
    const result = validatePVSizingInput({
      ...validInput,
      systemEfficiency: Number.NaN,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_SYSTEM_EFFICIENCY,
      }),
    );
  });

  it("rejects non-finite panel power when provided", () => {
    const result = validatePVSizingInput({
      ...validInput,
      panelPowerW: Number.NaN,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_PANEL_POWER,
        field: "panelPowerW",
        severity: "error",
      }),
    );
  });

  it("rejects zero panel power when provided", () => {
    const result = validatePVSizingInput({
      ...validInput,
      panelPowerW: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_PANEL_POWER,
      }),
    );
  });

  it("rejects negative panel power when provided", () => {
    const result = validatePVSizingInput({
      ...validInput,
      panelPowerW: -550,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_ERROR_CODES.INVALID_PANEL_POWER,
      }),
    );
  });

  it("accepts input without optional panel power", () => {
    const result = validatePVSizingInput({
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("collects multiple validation errors", () => {
    const result = validatePVSizingInput({
      dailyEnergyKWh: 0,
      peakSunHours: 0,
      systemEfficiency: 0,
      panelPowerW: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(4);

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: PV_SIZING_ERROR_CODES.INVALID_DAILY_ENERGY,
        }),
        expect.objectContaining({
          code: PV_SIZING_ERROR_CODES.INVALID_PEAK_SUN_HOURS,
        }),
        expect.objectContaining({
          code: PV_SIZING_ERROR_CODES.INVALID_SYSTEM_EFFICIENCY,
        }),
        expect.objectContaining({
          code: PV_SIZING_ERROR_CODES.INVALID_PANEL_POWER,
        }),
      ]),
    );
  });

  it("returns no warnings for normal peak sun hours", () => {
    const result = validatePVSizingInput(validInput);

    expect(result.warnings).toHaveLength(0);
  });

  it("does not mutate the input", () => {
    const input = { ...validInput };
    const original = { ...input };

    validatePVSizingInput(input);

    expect(input).toEqual(original);
  });
});