import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getAuditResults,
} from "../../src/application/results/get-audit-results.js";

import type {
  AuditCalculationResult,
} from "../../src/domain/result.js";

import type {
  ResultRepository,
} from "../../src/persistence/index.js";

describe("getAuditResults", () => {
  it("retrieves all calculation results for an audit", async () => {
    const results: AuditCalculationResult[] = [
      {
        auditId: "audit-001",
        calculationName: "load-audit",
        result: {
          valid: true,
          status: "SUCCESS",
          value: {
            loads: [],
            totalConnectedLoadW: 500,
            totalRunningLoadW: 500,
            totalDemandLoadW: 500,
            totalApparentPowerVA: 555.56,
            dailyEnergyWh: 4000,
            monthlyEnergyWh: 120000,
            peakDemandW: 500,
            designMargin: 0.2,
            designPeakDemandW: 600,
          },
          errors: [],
          warnings: [],
          assumptions: [],
          trace: {
            steps: [],
          },
          metadata: {},
        },
        savedAt:
          "2026-10-01T10:01:00.000Z",
      },
    ];

    const resultRepository: ResultRepository = {
      async save(value) {
        return value;
      },

      async findByAuditId(auditId) {
        expect(auditId).toBe(
          "audit-001",
        );

        return results;
      },
    };

    const result =
      await getAuditResults(
        "audit-001",
        {
          results: resultRepository,
        },
      );

    expect(result).toEqual(
      results,
    );
  });

  it("returns an empty array when the audit has no results", async () => {
    const resultRepository: ResultRepository = {
      async save(value) {
        return value;
      },

      async findByAuditId() {
        return [];
      },
    };

    const result =
      await getAuditResults(
        "audit-001",
        {
          results: resultRepository,
        },
      );

    expect(result).toEqual([]);
  });
});