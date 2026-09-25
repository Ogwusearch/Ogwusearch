import {
  describe,
  expect,
  it,
} from "vitest";

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
      result.output?.loads.map(
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
});
