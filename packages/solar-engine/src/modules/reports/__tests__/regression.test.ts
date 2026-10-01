import { describe, expect, it } from "vitest";

import {
  buildReport,
  collectResults,
} from "../calculation/index.js";

import {
  runReports,
} from "../run.js";

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
        code: "UPSTREAM_WARNING",
        severity: "WARNING" as const,
        message: "Upstream calculation requires review.",
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
        code: "UPSTREAM_ERROR",
        severity: "ERROR" as const,
        message: "Upstream calculation failed.",
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

describe("Reports regression", () => {
  it("produces deterministic output", () => {
    const input: ReportsInput = {
      load: successfulResult({
        dailyEnergyKWh: 18.75,
      }),
      pvSizing: successfulResult({
        totalModules: 24,
        arrayPowerW: 13_200,
      }),
      costing: successfulResult({
        subtotal: 5_000_000,
        totalCost: 5_250_000,
      }),
    };

    const first = runReports(input);
    const second = runReports(input);

    expect(second).toEqual(first);
  });

  it("does not mutate the input", () => {
    const input: ReportsInput = {
      load: successfulResult({
        dailyEnergyKWh: 18.75,
      }),
      pvSizing: successfulResult({
        totalModules: 24,
      }),
    };

    const before = structuredClone(input);

    runReports(input);

    expect(input).toEqual(before);
  });

  it("keeps a failed upstream result represented as an error result", () => {
    const upstream = errorResult();

    const report = buildReport({
      inverter: upstream,
    });

    expect(report.sections).toHaveLength(1);
    expect(report.sections[0]?.result).toBe(upstream);
    expect(report.errors).toEqual(upstream.errors);
  });

  it("preserves an upstream WARNING status", () => {
    const upstream = warningResult({
      totalModules: 12,
    });

    const report = buildReport({
      pvSizing: upstream,
    });

    expect(report.sections[0]?.result.status).toBe("WARNING");
    expect(report.sections[0]?.result.valid).toBe(true);
    expect(report.warnings).toEqual(upstream.warnings);
  });

  it("preserves upstream trace without rewriting it", () => {
    const upstream = {
      ...successfulResult({
        totalModules: 12,
      }),
      trace: {
        steps: [
          {
            id: "pv-sizing-input",
            name: "Validate PV sizing input",
            sequence: 1,
          },
          {
            id: "pv-sizing-calculate",
            name: "Calculate PV sizing",
            formula: "required energy / module contribution",
            sequence: 2,
          },
        ],
      },
    };

    const originalTrace = structuredClone(upstream.trace);

    const report = buildReport({
      pvSizing: upstream,
    });

    expect(report.sections[0]?.result.trace).toEqual(
      originalTrace,
    );
  });

  it("does not recalculate engineering values", () => {
    const upstream = successfulResult({
      totalModules: 17,
      arrayPowerW: 9_350,
      modulesPerString: 5,
      parallelStrings: 4,
    });

    const report = buildReport({
      pvSizing: upstream,
    });

    expect(report.sections[0]?.result.value).toBe(
      upstream.value,
    );

    expect(report.sections[0]?.result.value).toEqual({
      totalModules: 17,
      arrayPowerW: 9_350,
      modulesPerString: 5,
      parallelStrings: 4,
    });
  });

  it("preserves deterministic source ordering", () => {
    const input: ReportsInput = {
      costing: successfulResult({
        totalCost: 5_000_000,
      }),
      battery: successfulResult({
        totalBatteryUnits: 8,
      }),
      load: successfulResult({
        dailyEnergyKWh: 20,
      }),
      pvSizing: successfulResult({
        totalModules: 24,
      }),
    };

    const results = collectResults(input);

    expect(results.map((result) => result.id)).toEqual([
      "load",
      "pvSizing",
      "battery",
      "costing",
    ]);
  });

  it("does not fabricate zero values for missing upstream values", () => {
    const upstream = {
      ...successfulResult({}),
      value: {},
    };

    const report = buildReport({
      inverter: upstream,
    });

    expect(report.sections[0]?.result.value).toEqual({});
    expect(
      Object.prototype.hasOwnProperty.call(
        report.sections[0]?.result.value,
        "quantity",
      ),
    ).toBe(false);
  });
});