import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateEnergy,
} from "../calculation.js";

describe("Energy Analysis calculations", () => {
  it("calculates daily, monthly, and annual energy", () => {
    const result = calculateEnergy({
      loads: [
        {
          loadId: "light-01",
          runningLoadW: 100,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
        },
      ],
    });

    expect(result.valid).toBe(true);

    expect(result.output).toEqual({
      loads: [
        {
          loadId: "light-01",
          dailyEnergyWh: 500,
          monthlyEnergyWh: 15000,
          annualEnergyWh: 180000,
        },
      ],

      totalDailyEnergyWh: 500,
      totalDailyEnergyKWh: 0.5,

      totalMonthlyEnergyWh: 15000,
      totalMonthlyEnergyKWh: 15,

      totalAnnualEnergyWh: 180000,
      totalAnnualEnergyKWh: 180,

      adjustedDailyEnergyWh: 500,
      adjustedMonthlyEnergyWh: 15000,
      adjustedAnnualEnergyWh: 180000,

      designDailyEnergyWh: 500,
      designMonthlyEnergyWh: 15000,
      designAnnualEnergyWh: 180000,

      adjustmentFactor: 1,
    });
  });

  it("calculates multiple loads independently", () => {
    const result = calculateEnergy({
      loads: [
        {
          loadId: "load-a",
          runningLoadW: 100,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
        },
        {
          loadId: "load-b",
          runningLoadW: 500,
          operatingHoursPerDay: 2,
          operatingDaysPerMonth: 20,
        },
      ],
    });

    expect(result.valid).toBe(true);

    expect(result.output?.totalDailyEnergyWh)
      .toBe(1500);

    expect(result.output?.totalMonthlyEnergyWh)
      .toBe(35000);

    expect(result.output?.totalAnnualEnergyWh)
      .toBe(420000);
  });

  it("applies system loss adjustment", () => {
    const result = calculateEnergy({
      loads: [
        {
          loadId: "load-a",
          runningLoadW: 1000,
          operatingHoursPerDay: 1,
          operatingDaysPerMonth: 30,
        },
      ],
      systemLossFactor: 0.10,
    });

    expect(result.valid).toBe(true);

    expect(
      result.output?.adjustmentFactor,
    ).toBeCloseTo(1 / 0.9);

    expect(
      result.output?.adjustedDailyEnergyWh,
    ).toBeCloseTo(1000 / 0.9);

    expect(
      result.output?.adjustedMonthlyEnergyWh,
    ).toBeCloseTo(30000 / 0.9);
  });

  it("applies design margin after loss adjustment", () => {
    const result = calculateEnergy({
      loads: [
        {
          loadId: "load-a",
          runningLoadW: 1000,
          operatingHoursPerDay: 1,
          operatingDaysPerMonth: 30,
        },
      ],
      systemLossFactor: 0.10,
      designMargin: 0.20,
    });

    expect(result.valid).toBe(true);

    expect(
      result.output?.designDailyEnergyWh,
    ).toBeCloseTo(
      (1000 / 0.9) * 1.2,
    );

    expect(
      result.output?.designMonthlyEnergyWh,
    ).toBeCloseTo(
      (30000 / 0.9) * 1.2,
    );
  });

  it("supports zero operating hours", () => {
    const result = calculateEnergy({
      loads: [
        {
          loadId: "load-a",
          runningLoadW: 1000,
          operatingHoursPerDay: 0,
          operatingDaysPerMonth: 30,
        },
      ],
    });

    expect(result.valid).toBe(true);

    expect(
      result.output?.totalDailyEnergyWh,
    ).toBe(0);

    expect(
      result.output?.totalMonthlyEnergyWh,
    ).toBe(0);

    expect(
      result.output?.totalAnnualEnergyWh,
    ).toBe(0);
  });
});
