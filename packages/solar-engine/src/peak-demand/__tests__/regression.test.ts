import { describe, expect, it } from "vitest";

import {
  calculatePeakDemand,
} from "../calculation/index.js";

describe("Peak Demand legacy regression", () => {
  it("preserves the legacy individual demand calculation", () => {
    const result = calculatePeakDemand({
      loads: [
        {
          loadId: "load-a",
          runningPowerW: 2000,
          demandFactor: 0.8,
        },
        {
          loadId: "load-b",
          runningPowerW: 3000,
          demandFactor: 0.5,
        },
      ],
    });

    expect(
      result.totalRunningPowerW,
    ).toBe(5000);

    expect(
      result.totalIndividualDemandW,
    ).toBe(3100);

    expect(
      result.loads[0]?.individualDemandW,
    ).toBe(1600);

    expect(
      result.loads[1]?.individualDemandW,
    ).toBe(1500);
  });
});
