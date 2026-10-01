import { describe, expect, it } from "vitest";

import {
  calculatePVSizing,
} from "../calculation/index.js";

import type {
  PVSizingInput,
} from "../types/index.js";

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
});
