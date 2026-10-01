import { describe, expect, it } from "vitest";

import {
  calculatePVSizing,
} from "../calculation/index.js";

import type {
  PVSizingInput,
} from "../types/index.js";

describe("PV sizing regression", () => {
  it("preserves the required PV energy calculation", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPVEnergyKWh).toBe(12.5);
  });

  it("preserves the required PV power calculation", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPVPowerW).toBe(2500);
    expect(result.requiredPVPowerKW).toBe(2.5);
  });

  it("preserves panel count and installed capacity calculations", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
      panelPowerW: 400,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPVEnergyKWh).toBe(12.5);
    expect(result.requiredPVPowerW).toBe(2500);
    expect(result.requiredPVPowerKW).toBe(2.5);

    expect(result.requiredPanelCount).toBe(7);
    expect(result.installedPVCapacityW).toBe(2800);
    expect(result.installedPVCapacityKW).toBe(2.8);

    expect(result.oversizingW).toBe(300);
    expect(result.oversizingKW).toBe(0.3);
    expect(result.oversizingRatio).toBe(0.12);
    expect(result.oversizingPercent).toBe(12);
  });

  it("does not perform panel sizing when panel power is omitted", () => {
    const input: PVSizingInput = {
      dailyEnergyKWh: 10,
      peakSunHours: 5,
      systemEfficiency: 0.8,
    };

    const result = calculatePVSizing(input);

    expect(result.requiredPVPowerW).toBe(2500);
    expect(result.requiredPVPowerKW).toBe(2.5);

    expect(result.panelPowerW).toBeUndefined();
    expect(result.requiredPanelCount).toBeUndefined();
    expect(result.installedPVCapacityW).toBeUndefined();
    expect(result.installedPVCapacityKW).toBeUndefined();
    expect(result.oversizingW).toBeUndefined();
    expect(result.oversizingKW).toBeUndefined();
    expect(result.oversizingRatio).toBeUndefined();
    expect(result.oversizingPercent).toBeUndefined();
  });
});
