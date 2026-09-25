
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  runLoadAudit,
} from "../run.js";

describe("Load Audit regression cases", () => {
  it("produces the expected residential load result", () => {
    const result = runLoadAudit({
      loads: [
        {
          id: "LIGHT-001",
          name: "LED Lights",
          category: "LIGHTING",
          quantity: 6,
          ratedPowerW: 10,
          powerFactor: 1,
          operatingHoursPerDay: 6,
          operatingDaysPerMonth: 30,
          phase: "SINGLE_PHASE",
        },
        {
          id: "TV-001",
          name: "TV",
          category: "APPLIANCE",
          quantity: 1,
          ratedPowerW: 120,
          powerFactor: 1,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
          phase: "SINGLE_PHASE",
        },
        {
          id: "FRIDGE-001",
          name: "Refrigerator",
          category: "APPLIANCE",
          quantity: 1,
          ratedPowerW: 150,
          powerFactor: 0.9,
          operatingHoursPerDay: 10,
          operatingDaysPerMonth: 30,
          phase: "SINGLE_PHASE",
        },
      ],
      designMargin: 0.2,
    });

    expect(result.valid).toBe(true);
    expect(result.status).toBeDefined();
    expect(result.value).toBeDefined();

    expect(
      result.value?.totalConnectedLoadW,
    ).toBe(330);

    expect(
      result.value?.dailyEnergyWh,
    ).toBe(2460);

    expect(
      result.value?.totalDemandLoadW,
    ).toBe(330);

    expect(
      result.value?.designPeakDemandW,
    ).toBeCloseTo(396);
  });

  it("does not calculate when validation fails", () => {
    const result = runLoadAudit({
      loads: [],
      designMargin: 0.2,
    });

    expect(result.valid).toBe(false);
    expect(result.value).toBeUndefined();

    expect(
      result.errors.length,
    ).toBeGreaterThan(0);
  });

  it("returns engineering metadata", () => {
    const result = runLoadAudit({
      loads: [],
      designMargin: 0.2,
    });

    expect(result.metadata).toBeDefined();

    expect(
      result.metadata.module,
    ).toBeDefined();

    expect(
      result.metadata.version,
    ).toBeDefined();
  });

  it("returns calculation trace on successful execution", () => {
    const result = runLoadAudit({
      loads: [
        {
          id: "LAMP-001",
          name: "Lamp",
          category: "LIGHTING",
          quantity: 1,
          ratedPowerW: 10,
          powerFactor: 1,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
          phase: "SINGLE_PHASE",
        },
      ],
      designMargin: 0.2,
    });

    expect(result.valid).toBe(true);
    expect(result.value).toBeDefined();

    expect(result.trace).toBeDefined();

    expect(
      result.trace.steps.length,
    ).toBeGreaterThan(0);
  });
});
