
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  validateLoad,
  validateLoadList,
} from "../validation/index.js";

import type {
  Load,
} from "../types/load.js";

function createLoad(
  overrides: Partial<Load> = {},
): Load {
  return {
    id: "LOAD-001",
    name: "LED Lamp",
    category: "LIGHTING",
    quantity: 1,
    ratedPowerW: 10,
    powerFactor: 1,
    operatingHoursPerDay: 5,
    operatingDaysPerMonth: 30,
    phase: "SINGLE_PHASE",
    ...overrides,
  };
}

describe("validateLoad", () => {
  it("accepts a valid load", () => {
    const issues = validateLoad(
      createLoad(),
    );

    expect(
      issues.filter(
        (issue) =>
          issue.severity === "ERROR",
      ),
    ).toHaveLength(0);
  });

  it("rejects an empty load ID", () => {
    const issues = validateLoad(
      createLoad({
        id: "",
      }),
    );

    expect(
      issues.some(
        (issue) =>
          issue.code === "EMPTY_LOAD_ID" &&
          issue.severity === "ERROR",
      ),
    ).toBe(true);
  });

  it("rejects an empty load name", () => {
    const issues = validateLoad(
      createLoad({
        name: "",
      }),
    );

    expect(
      issues.some(
        (issue) =>
          issue.code === "EMPTY_LOAD_NAME" &&
          issue.severity === "ERROR",
      ),
    ).toBe(true);
  });

  it("rejects zero or negative quantity", () => {
    const zeroIssues = validateLoad(
      createLoad({
        quantity: 0,
      }),
    );

    const negativeIssues = validateLoad(
      createLoad({
        quantity: -1,
      }),
    );

    expect(
      zeroIssues.some(
        (issue) =>
          issue.code === "INVALID_QUANTITY",
      ),
    ).toBe(true);

    expect(
      negativeIssues.some(
        (issue) =>
          issue.code === "INVALID_QUANTITY",
      ),
    ).toBe(true);
  });

  it("rejects zero or negative rated power", () => {
    const zeroIssues = validateLoad(
      createLoad({
        ratedPowerW: 0,
      }),
    );

    const negativeIssues = validateLoad(
      createLoad({
        ratedPowerW: -100,
      }),
    );

    expect(
      zeroIssues.some(
        (issue) =>
          issue.code === "INVALID_RATED_POWER",
      ),
    ).toBe(true);

    expect(
      negativeIssues.some(
        (issue) =>
          issue.code === "INVALID_RATED_POWER",
      ),
    ).toBe(true);
  });

  it("rejects invalid power factor", () => {
    const zeroIssues = validateLoad(
      createLoad({
        powerFactor: 0,
      }),
    );

    const highIssues = validateLoad(
      createLoad({
        powerFactor: 1.5,
      }),
    );

    expect(
      zeroIssues.some(
        (issue) =>
          issue.code === "INVALID_POWER_FACTOR",
      ),
    ).toBe(true);

    expect(
      highIssues.some(
        (issue) =>
          issue.code === "INVALID_POWER_FACTOR",
      ),
    ).toBe(true);
  });

  it("warns about low power factor", () => {
    const issues = validateLoad(
      createLoad({
        powerFactor: 0.7,
      }),
    );

    expect(
      issues.some(
        (issue) =>
          issue.code === "LOW_POWER_FACTOR" &&
          issue.severity === "WARNING",
      ),
    ).toBe(true);

    expect(
      issues.some(
        (issue) =>
          issue.severity === "ERROR",
      ),
    ).toBe(false);
  });

  it("rejects operating hours above 24", () => {
    const issues = validateLoad(
      createLoad({
        operatingHoursPerDay: 25,
      }),
    );

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_OPERATING_HOURS",
      ),
    ).toBe(true);
  });

  it("rejects negative operating hours", () => {
    const issues = validateLoad(
      createLoad({
        operatingHoursPerDay: -1,
      }),
    );

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_OPERATING_HOURS",
      ),
    ).toBe(true);
  });

  it("rejects operating days above 31", () => {
    const issues = validateLoad(
      createLoad({
        operatingDaysPerMonth: 32,
      }),
    );

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_OPERATING_DAYS",
      ),
    ).toBe(true);
  });

  it("rejects invalid efficiency", () => {
    const zeroIssues = validateLoad(
      createLoad({
        efficiency: 0,
      }),
    );

    const highIssues = validateLoad(
      createLoad({
        efficiency: 1.1,
      }),
    );

    expect(
      zeroIssues.some(
        (issue) =>
          issue.code === "INVALID_EFFICIENCY",
      ),
    ).toBe(true);

    expect(
      highIssues.some(
        (issue) =>
          issue.code === "INVALID_EFFICIENCY",
      ),
    ).toBe(true);
  });

  it("rejects invalid demand factor", () => {
    const zeroIssues = validateLoad(
      createLoad({
        demandFactor: 0,
      }),
    );

    const highIssues = validateLoad(
      createLoad({
        demandFactor: 1.1,
      }),
    );

    expect(
      zeroIssues.some(
        (issue) =>
          issue.code === "INVALID_DEMAND_FACTOR",
      ),
    ).toBe(true);

    expect(
      highIssues.some(
        (issue) =>
          issue.code === "INVALID_DEMAND_FACTOR",
      ),
    ).toBe(true);
  });

  it("rejects diversity factor below 1", () => {
    const issues = validateLoad(
      createLoad({
        diversityFactor: 0.8,
      }),
    );

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_DIVERSITY_FACTOR",
      ),
    ).toBe(true);
  });

  it("accepts diversity factor of 1", () => {
    const issues = validateLoad(
      createLoad({
        diversityFactor: 1,
      }),
    );

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_DIVERSITY_FACTOR",
      ),
    ).toBe(false);
  });
});

describe("validateLoadList", () => {
  it("rejects an empty load list", () => {
    const issues = validateLoadList([]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "EMPTY_LOAD_LIST" &&
          issue.severity === "ERROR",
      ),
    ).toBe(true);
  });

  it("accepts a valid load list", () => {
    const issues = validateLoadList([
      createLoad(),
    ]);

    expect(
      issues.filter(
        (issue) =>
          issue.severity === "ERROR",
      ),
    ).toHaveLength(0);
  });

  it("rejects duplicate load IDs", () => {
    const issues = validateLoadList([
      createLoad({
        id: "LOAD-001",
      }),
      createLoad({
        id: "LOAD-001",
        name: "Second Load",
      }),
    ]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "DUPLICATE_LOAD_ID",
      ),
    ).toBe(true);
  });

  it("prefixes load validation paths with the load index", () => {
    const issues = validateLoadList([
      createLoad({
        quantity: 0,
      }),
    ]);

    const issue = issues.find(
      (item) =>
        item.code === "INVALID_QUANTITY",
    );

    expect(issue?.path).toBe(
      "loads[0].quantity",
    );
  });

  it("validates every load in the list", () => {
    const issues = validateLoadList([
      createLoad({
        id: "LOAD-001",
        quantity: 0,
      }),
      createLoad({
        id: "LOAD-002",
        ratedPowerW: -100,
      }),
    ]);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_QUANTITY" &&
          issue.path === "loads[0].quantity",
      ),
    ).toBe(true);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_RATED_POWER" &&
          issue.path === "loads[1].ratedPowerW",
      ),
    ).toBe(true);
  });
});
