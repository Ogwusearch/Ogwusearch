import {
  describe,
  expect,
  it,
} from "vitest";

import {
  validateEnergy,
} from "../validation/index.js";

describe("Energy Analysis validation", () => {
  it("rejects empty loads", () => {
    const issues = validateEnergy({
      loads: [],
    });

    expect(
      issues.some(
        (issue) => issue.code === "NO_LOADS",
      ),
    ).toBe(true);
  });

  it("rejects negative running load", () => {
    const issues = validateEnergy({
      loads: [
        {
          loadId: "load-01",
          runningLoadW: -100,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
        },
      ],
    });

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_RUNNING_LOAD",
      ),
    ).toBe(true);
  });

  it("rejects operating hours above 24", () => {
    const issues = validateEnergy({
      loads: [
        {
          loadId: "load-01",
          runningLoadW: 100,
          operatingHoursPerDay: 25,
          operatingDaysPerMonth: 30,
        },
      ],
    });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_OPERATING_HOURS",
      ),
    ).toBe(true);
  });

  it("rejects operating days above 31", () => {
    const issues = validateEnergy({
      loads: [
        {
          loadId: "load-01",
          runningLoadW: 100,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 32,
        },
      ],
    });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_OPERATING_DAYS",
      ),
    ).toBe(true);
  });

  it("rejects loss factor of 1 or greater", () => {
    const issues = validateEnergy({
      loads: [
        {
          loadId: "load-01",
          runningLoadW: 100,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
        },
      ],
      systemLossFactor: 1,
    });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_SYSTEM_LOSS_FACTOR",
      ),
    ).toBe(true);
  });

  it("rejects design margin above 100 percent", () => {
    const issues = validateEnergy({
      loads: [
        {
          loadId: "load-01",
          runningLoadW: 100,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
        },
      ],
      designMargin: 1.01,
    });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_DESIGN_MARGIN",
      ),
    ).toBe(true);
  });

  it("rejects duplicate load IDs", () => {
    const issues = validateEnergy({
      loads: [
        {
          loadId: "duplicate",
          runningLoadW: 100,
          operatingHoursPerDay: 5,
          operatingDaysPerMonth: 30,
        },
        {
          loadId: "duplicate",
          runningLoadW: 200,
          operatingHoursPerDay: 3,
          operatingDaysPerMonth: 30,
        },
      ],
    });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "DUPLICATE_LOAD_ID",
      ),
    ).toBe(true);
  });

  it("accepts valid energy input", () => {
    const issues = validateEnergy({
      loads: [
        {
          loadId: "load-01",
          runningLoadW: 500,
          operatingHoursPerDay: 8,
          operatingDaysPerMonth: 26,
        },
      ],
      systemLossFactor: 0.15,
      designMargin: 0.20,
    });

    expect(issues).toEqual([]);
  });
});
