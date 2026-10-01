import { describe, expect, it } from "vitest";

import {
  buildReport,
  buildSections,
  collectResults,
} from "../calculation/index.js";

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

function warningResult(
  value: Record<string, unknown>,
) {
  return {
    status: "WARNING" as const,
    valid: true,
    value,
    errors: [],
    warnings: [
      {
        code: "TEST_WARNING",
        severity: "WARNING" as const,
        message: "Test warning",
      },
    ],
    assumptions: [],
    trace: {
      steps: [],
    },
    metadata: {},
  };
}

function errorResult() {
  return {
    status: "ERROR" as const,
    valid: false,
    errors: [
      {
        code: "TEST_ERROR",
        severity: "ERROR" as const,
        message: "Test error",
      },
    ],
    warnings: [],
    assumptions: [],
    trace: {
      steps: [],
    },
    metadata: {},
  };
}

describe("Reports calculation", () => {
  it("collects supplied module results", () => {
    const load = successfulResult({
      dailyEnergyKWh: 10,
    });

    const peakDemand = successfulResult({
      peakDemandW: 5_000,
    });

    const input: ReportsInput = {
      load,
      peakDemand,
    };

    const results = collectResults(input);

    expect(results).toHaveLength(2);

    expect(results[0]).toMatchObject({
      id: "load",
      title: "Load Analysis",
      result: load,
    });

    expect(results[1]).toMatchObject({
      id: "peakDemand",
      title: "Peak Demand",
      result: peakDemand,
    });
  });

  it("preserves the original result objects", () => {
    const load = successfulResult({
      dailyEnergyKWh: 10,
    });

    const input: ReportsInput = {
      load,
    };

    const sections = buildSections(input);

    expect(sections).toHaveLength(1);
    expect(sections[0]?.result).toBe(load);
  });

  it("preserves deterministic source section order", () => {
    const input: ReportsInput = {
      costing: successfulResult({
        totalCost: 5_000_000,
      }),
      load: successfulResult({
        dailyEnergyKWh: 10,
      }),
      battery: successfulResult({
        totalBatteryUnits: 4,
      }),
      pvSizing: successfulResult({
        totalModules: 12,
      }),
    };

    const sections = buildSections(input);

    expect(sections.map((section) => section.id)).toEqual([
      "load",
      "pvSizing",
      "battery",
      "costing",
    ]);
  });

  it("appends additional results after named results", () => {
    const load = successfulResult({
      dailyEnergyKWh: 10,
    });

    const additional = successfulResult({
      customValue: 123,
    });

    const input: ReportsInput = {
      load,
      additionalResults: [additional],
    };

    const results = collectResults(input);

    expect(results).toHaveLength(2);

    expect(results[0]?.id).toBe("load");
    expect(results[1]).toMatchObject({
      id: "additional-1",
      title: "Additional Result 1",
      result: additional,
    });
  });

  it("aggregates warnings from source results", () => {
    const warning = warningResult({
      totalModules: 12,
    });

    const report = buildReport({
      pvSizing: warning,
    });

    expect(report.warnings).toHaveLength(1);
    expect(report.warnings[0]?.code).toBe("TEST_WARNING");
  });

  it("aggregates errors from source results", () => {
    const error = errorResult();

    const report = buildReport({
      inverter: error,
    });

    expect(report.errors).toHaveLength(1);
    expect(report.errors[0]?.code).toBe("TEST_ERROR");
  });

  it("preserves assumptions from source results", () => {
    const result = {
      ...successfulResult({
        totalModules: 12,
      }),
      assumptions: [
        {
          code: "TEST_ASSUMPTION",
          name: "Test assumption",
          value: 0.8,
          unit: "ratio",
        },
      ],
    };

    const report = buildReport({
      pvSizing: result,
    });

    expect(report.assumptions).toEqual([
      {
        code: "TEST_ASSUMPTION",
        name: "Test assumption",
        value: 0.8,
        unit: "ratio",
      },
    ]);
  });

  it("exposes the same authoritative results through sections and results", () => {
    const load = successfulResult({
      dailyEnergyKWh: 10,
    });

    const report = buildReport({
      load,
    });

    expect(report.sections[0]?.result).toBe(load);
    expect(report.results[0]).toBe(load);
  });
});