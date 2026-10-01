import { describe, expect, it } from "vitest";

import {
  calculateContinuousDemand,
  calculateDesignDemand,
  calculateStartingDemand,
  calculatePeakDemand,
} from "../calculation/index.js";

describe("Peak Demand calculations", () => {
  it("calculates individual continuous demand", () => {
    expect(
      calculateContinuousDemand(1000, 0.8),
    ).toBe(800);
  });

  it("uses explicit starting power", () => {
    expect(
      calculateStartingDemand(
        1000,
        2500,
        2,
      ),
    ).toBe(2500);
  });

  it("uses surge factor when starting power is absent", () => {
    expect(
      calculateStartingDemand(
        1000,
        undefined,
        2.5,
      ),
    ).toBe(2500);
  });

  it("calculates design demand", () => {
    expect(
      calculateDesignDemand(
        10000,
        0.2,
      ),
    ).toBe(12000);
  });

  it("calculates normal coincident demand", () => {
    const result = calculatePeakDemand({
      diversityFactor: 2,
      loads: [
        {
          loadId: "load-a",
          runningPowerW: 2000,
          demandFactor: 1,
        },
        {
          loadId: "load-b",
          runningPowerW: 3000,
          demandFactor: 1,
        },
      ],
    });

    expect(
      result.totalIndividualDemandW,
    ).toBe(5000);

    expect(
      result.normalCoincidentDemandW,
    ).toBe(2500);
  });

  it("applies design margin", () => {
    const result = calculatePeakDemand({
      demandMargin: 0.2,
      loads: [
        {
          loadId: "load-a",
          runningPowerW: 10000,
        },
      ],
    });

    expect(result.peakDemandW).toBe(10000);
    expect(result.designPeakDemandW).toBe(12000);
  });

  it("captures starting demand as a scenario", () => {
    const result = calculatePeakDemand({
      loads: [
        {
          loadId: "motor",
          runningPowerW: 5000,
          startingPowerW: 15000,
        },
        {
          loadId: "lighting",
          runningPowerW: 3000,
        },
      ],
    });

    expect(result.startingDemandW).toBe(18000);
    expect(result.peakDemandW).toBe(18000);
  });
});
