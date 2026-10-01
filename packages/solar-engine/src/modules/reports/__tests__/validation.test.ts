import { describe, expect, it } from "vitest";

import {
  validateReports,
  validateReportsInput,
} from "../validation/index.js";

import type {
  ReportsInput,
} from "../types/index.js";

function successfulResult(
  value: Record<string, unknown>,
) {
  return {
    status: "SUCCESS" as const,
    valid: true,
    value,
    errors: [],
    warnings: [],
    assumptions: [],
    trace: {
      steps: [],
    },
    metadata: {},
  };
}

describe("Reports validation", () => {
  it("rejects completely empty input", () => {
    const issues = validateReports({});

    expect(
      issues.some(
        (issue) =>
          issue.code === "REPORT_NO_RESULTS",
      ),
    ).toBe(true);
  });

  it("accepts a single source result", () => {
    const input: ReportsInput = {
      load: successfulResult({
        dailyEnergyKWh: 10,
      }),
    };

    expect(validateReports(input)).toHaveLength(0);
  });

  it("accepts additional results", () => {
    const input: ReportsInput = {
      additionalResults: [
        successfulResult({
          customValue: 123,
        }),
      ],
    };

    expect(validateReportsInput(input)).toHaveLength(0);
  });

  it("accepts a valid report ID", () => {
    const input: ReportsInput = {
      reportId: "report-001",
      load: successfulResult({
        dailyEnergyKWh: 10,
      }),
    };

    expect(validateReports(input)).toHaveLength(0);
  });

  it("rejects an empty report ID", () => {
    const input: ReportsInput = {
      reportId: "   ",
      load: successfulResult({
        dailyEnergyKWh: 10,
      }),
    };

    const issues = validateReports(input);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_REPORT_ID",
      ),
    ).toBe(true);
  });

  it("accepts a valid report title", () => {
    const input: ReportsInput = {
      title: "Residential Solar Report",
      load: successfulResult({
        dailyEnergyKWh: 10,
      }),
    };

    expect(validateReports(input)).toHaveLength(0);
  });

  it("rejects an empty report title", () => {
    const input: ReportsInput = {
      title: "",
      load: successfulResult({
        dailyEnergyKWh: 10,
      }),
    };

    const issues = validateReports(input);

    expect(
      issues.some(
        (issue) =>
          issue.code === "INVALID_REPORT_TITLE",
      ),
    ).toBe(true);
  });
});