import { describe, expect, it } from "vitest";

import { runLoadAudit } from "../run";

describe("Load Audit regression cases", () => {
  it("produces the expected residential load result", () => {
    const result = runLoadAudit({
      loads: [
        {
          appliance: "LED Lights",
          quantity: 6,
          ratedPowerW: 10,
          hoursPerDay: 6,
        },
        {
          appliance: "TV",
          quantity: 1,
          ratedPowerW: 120,
          hoursPerDay: 5,
        },
        {
          appliance: "Refrigerator",
          quantity: 1,
          ratedPowerW: 150,
          hoursPerDay: 10,
          powerFactor: 0.9,
        },
      ],
      diversityFactor: 0.8,
      designMargin: 0.2,
    });

    expect(result.success).toBe(true);

    expect(result.value?.totalConnectedLoadW).toBe(330);
    expect(result.value?.totalDailyEnergyWh).toBe(2460);
    expect(result.value?.diversifiedLoadW).toBe(264);
    expect(result.value?.designLoadW).toBeCloseTo(316.8);
  });

  it("does not calculate when validation fails", () => {
    const result = runLoadAudit({
      loads: [],
      diversityFactor: 0.8,
      designMargin: 0.2,
    });

    expect(result.success).toBe(false);
    expect(result.value).toBeUndefined();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("always returns engineering metadata", () => {
    const result = runLoadAudit({
      loads: [],
      diversityFactor: 0.8,
      designMargin: 0.2,
    });

    expect(result.metadata.engineVersion).toBe("0.1.0");
    expect(result.metadata.calculationVersion).toBe("0.1.0");
    expect(result.metadata.moduleVersion).toBe("0.1.0");
    expect(result.metadata.calculatedAt).toBeTruthy();
  });

  it("returns calculation trace on successful execution", () => {
    const result = runLoadAudit({
      loads: [
        {
          appliance: "Lamp",
          quantity: 1,
          ratedPowerW: 10,
          hoursPerDay: 5,
        },
      ],
      diversityFactor: 0.8,
      designMargin: 0.2,
    });

    expect(result.success).toBe(true);
    expect(result.trace).toBeDefined();
    expect(result.trace?.formulas.length).toBeGreaterThan(0);
    expect(result.trace?.steps.length).toBeGreaterThan(0);
  });
});
