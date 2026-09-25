
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateLoadAudit,
} from "../calculation.js";

import type {
  LoadAuditInput,
} from "../types/load-input.js";

function createLoad(
  overrides: Partial<
    LoadAuditInput["loads"][number]
  > = {},
): LoadAuditInput["loads"][number] {
  return {
    id: "LOAD-001",
    name: "Test Load",
    category: "APPLIANCE",
    quantity: 1,
    ratedPowerW: 100,
    powerFactor: 1,
    operatingHoursPerDay: 2,
    operatingDaysPerMonth: 30,
    phase: "SINGLE_PHASE",
    ...overrides,
  };
}

describe("calculateLoadAudit", () => {
  it("calculates total connected load", () => {
    const input: LoadAuditInput = {
      loads: [
        createLoad({
          quantity: 4,
          ratedPowerW: 10,
          operatingHoursPerDay: 5,
        }),
      ],
      designMargin: 0,
    };

    const result =
      calculateLoadAudit(input);

    expect(
      result.totalConnectedLoadW,
    ).toBe(40);
  });

  it("calculates daily energy", () => {
    const input: LoadAuditInput = {
      loads: [
        createLoad({
          quantity: 4,
          ratedPowerW: 10,
          operatingHoursPerDay: 5,
        }),
      ],
      designMargin: 0,
    };

    const result =
      calculateLoadAudit(input);

    expect(
      result.dailyEnergyWh,
    ).toBe(200);
  });

  it("calculates monthly energy", () => {
    const input: LoadAuditInput = {
      loads: [
        createLoad({
          quantity: 4,
          ratedPowerW: 10,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
        }),
      ],
      designMargin: 0,
    };

    const result =
      calculateLoadAudit(input);

    expect(
      result.monthlyEnergyWh,
    ).toBe(6000);
  });

  it("applies diversity factor", () => {
    const input: LoadAuditInput = {
      loads: [
        createLoad({
          id: "LOAD-A",
          name: "Load A",
          ratedPowerW: 1000,
          operatingHoursPerDay: 1,
          diversityFactor: 1.25,
        }),
        createLoad({
          id: "LOAD-B",
          name: "Load B",
          ratedPowerW: 500,
          operatingHoursPerDay: 1,
          diversityFactor: 1.25,
        }),
      ],
      designMargin: 0,
    };

    const result =
      calculateLoadAudit(input);

    expect(
      result.totalConnectedLoadW,
    ).toBe(1500);

    expect(
      result.totalDemandLoadW,
    ).toBe(1200);
  });

  it("applies design margin", () => {
    const input: LoadAuditInput = {
      loads: [
        createLoad({
          ratedPowerW: 1000,
          operatingHoursPerDay: 1,
        }),
      ],
      designMargin: 0.25,
    };

    const result =
      calculateLoadAudit(input);

    expect(
      result.peakDemandW,
    ).toBe(1000);

    expect(
      result.designPeakDemandW,
    ).toBe(1250);
  });

  it("calculates apparent power when power factor is provided", () => {
    const input: LoadAuditInput = {
      loads: [
        createLoad({
          ratedPowerW: 1000,
          operatingHoursPerDay: 2,
          powerFactor: 0.8,
        }),
      ],
      designMargin: 0,
    };

    const result =
      calculateLoadAudit(input);

    expect(
      result.loads[0]?.apparentPowerVA,
    ).toBe(1250);
  });

  it("calculates multiple loads independently", () => {
    const input: LoadAuditInput = {
      loads: [
        createLoad({
          id: "LOAD-001",
          name: "Lamp",
          quantity: 4,
          ratedPowerW: 20,
          operatingHoursPerDay: 5,
        }),
        createLoad({
          id: "LOAD-002",
          name: "TV",
          quantity: 1,
          ratedPowerW: 120,
          operatingHoursPerDay: 6,
        }),
      ],
      designMargin: 0.2,
    };

    const result =
      calculateLoadAudit(input);

    expect(
      result.totalConnectedLoadW,
    ).toBe(200);

    expect(
      result.dailyEnergyWh,
    ).toBe(1120);

    expect(
      result.totalDemandLoadW,
    ).toBe(200);

    expect(
      result.designPeakDemandW,
    ).toBe(240);
  });
});