import {
  describe,
  expect,
  it,
} from "vitest";

import {
  runEnergyAnalysis,
} from "../run.js";

import {
  calculateEnergy,
} from "../calculation.js";

describe("Energy Analysis regression", () => {
  const input = {
    loads: [
      {
        loadId: "lighting",
        runningLoadW: 600,
        operatingHoursPerDay: 8,
        operatingDaysPerMonth: 30,
      },
      {
        loadId: "office",
        runningLoadW: 1200,
        operatingHoursPerDay: 6,
        operatingDaysPerMonth: 26,
      },
      {
        loadId: "pump",
        runningLoadW: 2200,
        operatingHoursPerDay: 3,
        operatingDaysPerMonth: 20,
      },
    ],
    systemLossFactor: 0.15,
    designMargin: 0.20,
  } as const;

  it("produces deterministic results", () => {
    const first = calculateEnergy(input);
    const second = calculateEnergy(input);

    expect(first).toEqual(second);
  });

  it("preserves load ordering", () => {
    const result = calculateEnergy(input);

    expect(
      result.loads.map(
        (load) => load.loadId,
      ),
    ).toEqual([
      "lighting",
      "office",
      "pump",
    ]);
  });

  it("does not mutate input", () => {
    const original = structuredClone(input);

    calculateEnergy(input);

    expect(input).toEqual(original);
  });

  it("attaches a value-aware calculation trace", () => {
    const result =
      runEnergyAnalysis(input);

    expect(result.trace).toBeDefined();

    expect(
      result.trace.steps.map(
        (step) => step.id,
      ),
    ).toEqual([
      "energy-daily-energy",
      "energy-monthly-energy",
      "energy-annual-energy",
      "energy-system-loss-adjustment",
      "energy-design-margin",
      "energy-output",
    ]);

    const dailyStep =
      result.trace.steps[0];

    expect(dailyStep?.formula).toBe(
      "dailyEnergyWh = runningLoadW × operatingHoursPerDay",
    );

    expect(
      dailyStep?.inputs,
    ).toEqual({
      loads: [
        {
          loadId: "lighting",
          runningLoadW: 600,
          operatingHoursPerDay: 8,
        },
        {
          loadId: "office",
          runningLoadW: 1200,
          operatingHoursPerDay: 6,
        },
        {
          loadId: "pump",
          runningLoadW: 2200,
          operatingHoursPerDay: 3,
        },
      ],
    });

    expect(
      dailyStep?.outputs,
    ).toEqual({
      totalDailyEnergyWh:
        result.value?.totalDailyEnergyWh,
    });

    const lossStep =
      result.trace.steps[3];

    expect(
      lossStep?.inputs,
    ).toMatchObject({
      systemLossFactor: 0.15,
    });

    expect(
      lossStep?.outputs,
    ).toMatchObject({
      adjustmentFactor:
        result.value?.adjustmentFactor,
      adjustedDailyEnergyWh:
        result.value?.adjustedDailyEnergyWh,
    });

    const designStep =
      result.trace.steps[4];

    expect(
      designStep?.formula,
    ).toBe(
      "designEnergyWh = adjustedEnergyWh × (1 + designMargin)",
    );

    expect(
      designStep?.inputs,
    ).toMatchObject({
      designMargin: 0.20,
    });

    expect(
      designStep?.outputs,
    ).toMatchObject({
      designDailyEnergyWh:
        result.value?.designDailyEnergyWh,
    });
  });


});
