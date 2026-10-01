// ============================================================
// @ogwusearch/engineering-core
// Calculation Context Tests
// ============================================================

import { describe, expect, it } from "vitest";

import {
  createCalculationContext,
} from "../../src/calculation/context.js";

describe("createCalculationContext", () => {
  it("uses the explicit calculationId", () => {
    const context = createCalculationContext({
      calculationId: "calc-test-001",
      startedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(context.calculationId).toBe("calc-test-001");
  });

  it("preserves projectId and runId", () => {
    const context = createCalculationContext({
      calculationId: "calc-test-002",
      projectId: "project-001",
      runId: "run-001",
      startedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(context.projectId).toBe("project-001");
    expect(context.runId).toBe("run-001");
  });

  it("preserves a supplied startedAt", () => {
    const startedAt = "2026-01-01T12:30:00.000Z";

    const context = createCalculationContext({
      calculationId: "calc-test-003",
      startedAt,
    });

    expect(context.startedAt).toBe(startedAt);
  });

  it("preserves metadata", () => {
    const metadata = {
      module: "test-module",
      version: "1.0.0",
      tags: ["test", "core"],
    };

    const context = createCalculationContext({
      calculationId: "calc-test-004",
      startedAt: "2026-01-01T00:00:00.000Z",
      metadata,
    });

    expect(context.metadata).toEqual(metadata);
  });

  it("preserves execution options", () => {
    const options = {
      precision: 4,
      traceEnabled: true,
    };

    const context = createCalculationContext({
      calculationId: "calc-test-005",
      startedAt: "2026-01-01T00:00:00.000Z",
      options,
    });

    expect(context.options).toEqual(options);
  });

  it("creates startedAt when one is not supplied", () => {
    const before = new Date().getTime();

    const context = createCalculationContext({
      calculationId: "calc-test-006",
    });

    const after = new Date().getTime();
    const actual = new Date(context.startedAt).getTime();

    expect(Number.isNaN(actual)).toBe(false);
    expect(actual).toBeGreaterThanOrEqual(before);
    expect(actual).toBeLessThanOrEqual(after);
  });
});
