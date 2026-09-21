import { describe, expect, it } from "vitest";

import {
  calculatePVSizing,
} from "../calculate";
import type { PVSizingInput } from "../types";

describe("calculatePVSizing", () => {
  it("calculates required PV energy from daily energy and system efficiency", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPVEnergyKWh).toBe(12.5);
  });

  it("calculates required PV power in watts", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPVPowerW).toBe(2500);
  });

  it("calculates required PV power in kilowatts", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPVPowerKW).toBe(2.5);
  });

  it("calculates required panel count when panel power is provided", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
      panelPowerW: 550,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPanelCount).toBe(5);
  });

  it("calculates installed PV capacity", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
      panelPowerW: 550,
    };

    const result = calculatePVSizing(input);

    expect(result.installedPVCapacityW).toBe(2750);
    expect(result.installedPVCapacityKW).toBe(2.75);
  });

  it("calculates PV oversizing", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
      panelPowerW: 550,
    };

    const result = calculatePVSizing(input);

    expect(result.oversizingW).toBe(250);
    expect(result.oversizingKW).toBe(0.25);
    expect(result.oversizingRatio).toBe(0.1);
    expect(result.oversizingPercent).toBe(10);
  });

  it("does not calculate panel metrics when panel power is omitted", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
    };

    const result = calculatePVSizing(input);

    expect(result.panelPowerW).toBeUndefined();
    expect(result.requiredPanelCount).toBeUndefined();
    expect(result.installedPVCapacityW).toBeUndefined();
    expect(result.installedPVCapacityKW).toBeUndefined();
    expect(result.oversizingW).toBeUndefined();
    expect(result.oversizingKW).toBeUndefined();
    expect(result.oversizingRatio).toBeUndefined();
    expect(result.oversizingPercent).toBeUndefined();
  });

  it("rounds panel count up to a whole panel", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 11,
      peakSunHours: 5,
      systemEfficiency: 0.8,
      panelPowerW: 550,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPVPowerW).toBe(2750);
    expect(result.requiredPanelCount).toBe(5);
    expect(result.installedPVCapacityW).toBe(2750);
    expect(result.oversizingW).toBe(0);
  });

  it("does not mutate the input", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
      panelPowerW: 550,
    };

    const original = { ...input };

    calculatePVSizing(input);

    expect(input).toEqual(original);
  });

  it("produces deterministic results", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
      panelPowerW: 550,
    };

    const first = calculatePVSizing(input);
    const second = calculatePVSizing(input);

    expect(first).toEqual(second);
  });
});