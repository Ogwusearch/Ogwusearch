import { describe, expect, it } from "vitest";

import type {
  CalculationResult,
  CalculationOutput,
} from "@ogwusearch/engineering-types";

import {
  saveResult,
  type SaveResultDependencies,
} from "../../../src/application/results/save-result.js";

import type { AuditCalculationResult } from "../../../src/domain/result.js";
import type { ResultRepository } from "../../../src/persistence/result-repository.js";

interface TestOutput extends CalculationOutput {
  readonly value: number;
}

function createResult(): CalculationResult<TestOutput> {
  return {
    status: "SUCCESS",
    valid: true,
    value: {
      value: 480,
    },
    errors: [],
    warnings: [],
    assumptions: [],
    trace: {
      steps: [],
    },
    metadata: {},
  };
}

function createDependencies(
  saved: AuditCalculationResult[],
): SaveResultDependencies {
  const repository: ResultRepository = {
    async save(
      result: AuditCalculationResult,
    ): Promise<AuditCalculationResult> {
      saved.push(result);
      return result;
    },

    async findByAuditId(
      auditId: string,
    ): Promise<readonly AuditCalculationResult[]> {
      return saved.filter(
        (result) => result.auditId === auditId,
      );
    },
  };

  return {
    results: repository,
  };
}

describe("saveResult", () => {
  it("preserves the audit identity", async () => {
    const saved: AuditCalculationResult[] = [];

    const result = createResult();

    const output = await saveResult(
      {
        auditId: "audit-001",
        calculationName: "load",
        result,
      },
      createDependencies(saved),
    );

    expect(output.auditId).toBe("audit-001");
    expect(saved[0]?.auditId).toBe("audit-001");
  });

  it("preserves the calculation name", async () => {
    const saved: AuditCalculationResult[] = [];

    const result = createResult();

    const output = await saveResult(
      {
        auditId: "audit-001",
        calculationName: "energy-analysis",
        result,
      },
      createDependencies(saved),
    );

    expect(output.calculationName).toBe(
      "energy-analysis",
    );
  });

  it("preserves the authoritative CalculationResult", async () => {
    const saved: AuditCalculationResult[] = [];

    const result = createResult();

    const output = await saveResult(
      {
        auditId: "audit-001",
        calculationName: "load",
        result,
      },
      createDependencies(saved),
    );

    expect(output.result).toBe(result);
    expect(output.result).toEqual(result);
  });

  it("uses the injected clock", async () => {
    const saved: AuditCalculationResult[] = [];

    const dependencies: SaveResultDependencies = {
      ...createDependencies(saved),
      now: () => "2026-10-01T12:00:00.000Z",
    };

    const output = await saveResult(
      {
        auditId: "audit-001",
        calculationName: "load",
        result: createResult(),
      },
      dependencies,
    );

    expect(output.savedAt).toBe(
      "2026-10-01T12:00:00.000Z",
    );
  });

  it("persists the complete audit calculation result", async () => {
    const saved: AuditCalculationResult[] = [];

    const result = createResult();

    const output = await saveResult(
      {
        auditId: "audit-001",
        calculationName: "load",
        result,
      },
      createDependencies(saved),
    );

    expect(saved).toHaveLength(1);
    expect(saved[0]).toBe(output);
  });

  it("preserves the CalculationResult payload", async () => {
    const saved: AuditCalculationResult[] = [];

    const result = createResult();

    const output = await saveResult(
      {
        auditId: "audit-001",
        calculationName: "load",
        result,
      },
      createDependencies(saved),
    );

    expect(output.result.valid).toBe(true);
    expect(output.result.value).toEqual({
      value: 480,
    });
    expect(output.result.errors).toEqual([]);
    expect(output.result.warnings).toEqual([]);
  });
});