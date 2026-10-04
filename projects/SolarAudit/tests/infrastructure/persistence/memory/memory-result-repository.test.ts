import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MemoryResultRepository,
} from "../../../../src/infrastructure/persistence/memory/memory-result-repository.js";

import type {
  AuditCalculationResult,
} from "../../../../src/domain/result.js";

import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  LoadAuditOutput,
} from "@ogwusearch/solar-engine";

describe("MemoryResultRepository", () => {
  function createResult(
    calculationName = "load-audit",
  ): AuditCalculationResult {
    const result: CalculationResult<LoadAuditOutput> = {
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
    };

    return {
      auditId: "audit-001",
      calculationName,
      result,
      savedAt:
        "2026-10-01T11:01:00.000Z",
    };
  }

  it("saves and retrieves results for an audit", async () => {
    const repository =
      new MemoryResultRepository();

    const result =
      createResult();

    await repository.save(result);

    await expect(
      repository.findByAuditId(
        result.auditId,
      ),
    ).resolves.toEqual([
      result,
    ]);
  });

  it("returns an empty array when an audit has no results", async () => {
    const repository =
      new MemoryResultRepository();

    await expect(
      repository.findByAuditId(
        "missing-audit",
      ),
    ).resolves.toEqual([]);
  });

  it("stores multiple calculation results for one audit", async () => {
    const repository =
      new MemoryResultRepository();

    const loadAudit =
      createResult("load-audit");

    const energyAnalysis =
      createResult("energy-analysis");

    await repository.save(loadAudit);
    await repository.save(energyAnalysis);

    await expect(
      repository.findByAuditId(
        "audit-001",
      ),
    ).resolves.toEqual([
      loadAudit,
      energyAnalysis,
    ]);
  });

  it("replaces a result with the same audit and calculation name", async () => {
    const repository =
      new MemoryResultRepository();

    const original =
      createResult("load-audit");

    const replacement = {
      ...original,
      savedAt:
        "2026-10-01T12:00:00.000Z",
    };

    await repository.save(original);
    await repository.save(replacement);

    await expect(
      repository.findByAuditId(
        "audit-001",
      ),
    ).resolves.toEqual([
      replacement,
    ]);
  });
});
