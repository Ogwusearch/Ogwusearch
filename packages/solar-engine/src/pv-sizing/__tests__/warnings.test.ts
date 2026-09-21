import { describe, expect, it } from "vitest";

import { PV_SIZING_CONSTANTS } from "../constants";
import type { PVSizingInput, PVSizingValue } from "../types";
import {
  generatePVSizingWarnings,
  PV_SIZING_WARNING_CODES,
} from "../warnings";

describe("generatePVSizingWarnings", () => {
  const validInput: PVSizingInput = {
    dailyEnergyKWh: 10,
    peakSunHours: 5,
    systemEfficiency: 0.8,
    panelPowerW: 550,
  };

  const validValue: PVSizingValue = {
    requiredPVPowerW: 2500,
    requiredPVPowerKW: 2.5,
    requiredPVEnergyKWh: 12.5,
    panelPowerW: 550,
    requiredPanelCount: 5,
    installedPVCapacityW: 2750,
    installedPVCapacityKW: 2.75,
    oversizingW: 250,
    oversizingKW: 0.25,
    oversizingRatio: 0.1,
    oversizingPercent: 10,
  };

  it("returns no warnings for normal peak sun hours", () => {
    const warnings = generatePVSizingWarnings(
      validInput,
      validValue,
    );

    expect(warnings).toHaveLength(0);
  });

  it("warns when peak sun hours are below the configured threshold", () => {
    const input: PVSizingInput = {
      ...validInput,
      peakSunHours:
        PV_SIZING_CONSTANTS.lowPeakSunHours - 0.5,
    };

    const warnings = generatePVSizingWarnings(
      input,
      validValue,
    );

    expect(warnings).toContainEqual(
      expect.objectContaining({
        code: PV_SIZING_WARNING_CODES.LOW_PEAK_SUN_HOURS,
        field: "peakSunHours",
        value: input.peakSunHours,
        severity: "warning",
      }),
    );
  });

  it("does not warn when peak sun hours equal the threshold", () => {
    const input: PVSizingInput = {
      ...validInput,
      peakSunHours:
        PV_SIZING_CONSTANTS.lowPeakSunHours,
    };

    const warnings = generatePVSizingWarnings(
      input,
      validValue,
    );

    expect(warnings).toHaveLength(0);
  });

  it("does not warn for zero peak sun hours", () => {
    const input: PVSizingInput = {
      ...validInput,
      peakSunHours: 0,
    };

    const warnings = generatePVSizingWarnings(
      input,
      validValue,
    );

    expect(warnings).toHaveLength(0);
  });

  it("does not warn for non-finite peak sun hours", () => {
    const input: PVSizingInput = {
      ...validInput,
      peakSunHours: Number.NaN,
    };

    const warnings = generatePVSizingWarnings(
      input,
      validValue,
    );

    expect(warnings).toHaveLength(0);
  });

  it("does not mutate the input", () => {
    const input: PVSizingInput = {
      ...validInput,
      peakSunHours: 2,
    };

    const originalInput = { ...input };

    generatePVSizingWarnings(
      input,
      validValue,
    );

    expect(input).toEqual(originalInput);
  });

  it("does not mutate the calculated value", () => {
    const input: PVSizingInput = {
      ...validInput,
      peakSunHours: 2,
    };

    const originalValue = { ...validValue };

    generatePVSizingWarnings(
      input,
      validValue,
    );

    expect(validValue).toEqual(originalValue);
  });

  it("produces deterministic warnings", () => {
    const input: PVSizingInput = {
      ...validInput,
      peakSunHours: 2,
    };

    const first = generatePVSizingWarnings(
      input,
      validValue,
    );

    const second = generatePVSizingWarnings(
      input,
      validValue,
    );

    expect(first).toEqual(second);
  });
});