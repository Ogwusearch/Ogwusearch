import { describe, expect, it } from "vitest";

import {
  validatePeakDemandInput,
} from "../validation/index.js";

describe("Peak Demand validation", () => {
  it("requires at least one load", () => {
    const issues = validatePeakDemandInput({
      loads: [],
    });

    expect(
      issues.some(
        (issue) =>
          issue.code === "EMPTY_LOADS",
      ),
    ).toBe(true);
  });

  it("rejects invalid demand factor", () => {
    const issues = validatePeakDemandInput({
      loads: [
        {
          loadId: "load-1",
          runningPowerW: 1000,
          demandFactor: 1.2,
        },
      ],
    });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_DEMAND_FACTOR",
      ),
    ).toBe(true);
  });

  it("rejects diversity factor below one", () => {
    const issues = validatePeakDemandInput({
      diversityFactor: 0.5,
      loads: [
        {
          loadId: "load-1",
          runningPowerW: 1000,
        },
      ],
    });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_DIVERSITY_FACTOR",
      ),
    ).toBe(true);
  });

  it("rejects duplicate load IDs", () => {
    const issues = validatePeakDemandInput({
      loads: [
        {
          loadId: "load-1",
          runningPowerW: 1000,
        },
        {
          loadId: "load-1",
          runningPowerW: 2000,
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

  it("rejects surge factor below one", () => {
    const issues = validatePeakDemandInput({
      loads: [
        {
          loadId: "motor",
          runningPowerW: 1000,
          surgeFactor: 0.5,
        },
      ],
    });

    expect(
      issues.some(
        (issue) =>
          issue.code ===
          "INVALID_SURGE_FACTOR",
      ),
    ).toBe(true);
  });
});
