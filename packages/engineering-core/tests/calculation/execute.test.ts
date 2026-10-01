import { describe, expect, it } from "vitest";
import {
  defineCalculation,
  executeCalculation,
} from "../../src/index.js";

describe("executeCalculation", () => {
  it("executes a valid calculation", () => {
    const result = executeCalculation(
      {
        name: "addition",
        calculate: (input: {
          a: number;
          b: number;
        }) => input.a + input.b,
      },
      {
        a: 2,
        b: 3,
      },
    );

    expect(result.valid).toBe(true);
    expect(result.status).toBe("SUCCESS");
    expect(result.value).toBe(5);
  });

  it("does not calculate invalid input", () => {
    const result = executeCalculation(
      {
        name: "positive-value",
        validate: () => [
          {
            code: "INVALID",
            severity: "ERROR",
            message: "Invalid input.",
          },
        ],
        calculate: () => 100,
      },
      {},
    );

    expect(result.valid).toBe(false);
    expect(result.status).toBe("ERROR");
    expect(result.value).toBeUndefined();
  });

  it("returns warning status when warnings exist", () => {
    const result = executeCalculation(
      {
        name: "warning-test",
        validate: () => [
          {
            code: "HIGH_UTILIZATION",
            severity: "WARNING",
            message: "High utilization.",
          },
        ],
        calculate: () => 50,
      },
      {},
    );

    expect(result.valid).toBe(true);
    expect(result.status).toBe("WARNING");
    expect(result.warnings).toHaveLength(1);
  });


  it("provides a writable trace context to the calculation", () => {
    const result = executeCalculation(
      defineCalculation({
        name: "trace-test",
        calculate: (_input, context) => {
          context.trace.steps.push({
            id: "step-1",
            name: "Test Step",
            formula: "1 + 1",
            inputs: {
              a: 1,
              b: 1,
            },
            outputs: {
              result: 2,
            },
          });

          return {};
        },
      }),
      {},
      {
        calculationId: "calc-trace-test",
        startedAt: "2026-01-01T00:00:00.000Z",
      },
    );

    expect(result.valid).toBe(true);
    expect(result.status).toBe("SUCCESS");
    expect(result.trace.steps).toHaveLength(1);
    expect(result.trace.steps[0]?.id).toBe("step-1");
  });

  it("preserves explicitly supplied execution context", () => {
    const result = executeCalculation(
      defineCalculation({
        name: "context-test",
        calculate: (_input, context) => {
          expect(context.calculationId).toBe("calc-context-test");
          expect(context.projectId).toBe("project-test");
          expect(context.runId).toBe("run-test");
          expect(context.startedAt).toBe(
            "2026-01-01T00:00:00.000Z",
          );
          expect(context.metadata).toEqual({
            module: "test",
          });
          expect(context.options).toEqual({
            deterministic: true,
          });

          return {};
        },
      }),
      {},
      {
        calculationId: "calc-context-test",
        projectId: "project-test",
        runId: "run-test",
        startedAt: "2026-01-01T00:00:00.000Z",
        metadata: {
          module: "test",
        },
        options: {
          deterministic: true,
        },
      },
    );

    expect(result.status).toBe("SUCCESS");
    expect(result.valid).toBe(true);
  });

  it("converts a validation exception into VALIDATION_FAILED", () => {
    const result = executeCalculation(
      defineCalculation({
        name: "validation-error-test",
        validate: () => {
          throw new Error("Validation exploded.");
        },
        calculate: () => ({}),
      }),
      {},
      {
        calculationId: "calc-validation-error",
        startedAt: "2026-01-01T00:00:00.000Z",
      },
    );

    expect(result.status).toBe("ERROR");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.code).toBe(
      "VALIDATION_FAILED",
    );
    expect(result.errors[0]?.message).toBe(
      "Validation exploded.",
    );
  });

  it("converts an assumption exception into INVALID_ASSUMPTION", () => {
    const result = executeCalculation(
      defineCalculation({
        name: "assumption-error-test",
        assumptions: () => {
          throw new Error("Assumption exploded.");
        },
        calculate: () => ({}),
      }),
      {},
      {
        calculationId: "calc-assumption-error",
        startedAt: "2026-01-01T00:00:00.000Z",
      },
    );

    expect(result.status).toBe("ERROR");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.code).toBe(
      "INVALID_ASSUMPTION",
    );
    expect(result.errors[0]?.message).toBe(
      "Assumption exploded.",
    );
  });

  it("converts a calculation exception into CALCULATION_FAILED", () => {
    const result = executeCalculation(
      defineCalculation({
        name: "calculation-error-test",
        calculate: () => {
          throw new Error("Calculation exploded.");
        },
      }),
      {},
      {
        calculationId: "calc-calculation-error",
        startedAt: "2026-01-01T00:00:00.000Z",
      },
    );

    expect(result.status).toBe("ERROR");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.code).toBe(
      "CALCULATION_FAILED",
    );
    expect(result.errors[0]?.message).toBe(
      "Calculation exploded.",
    );
  });

  it("assigns trace sequence numbers in execution order", () => {
    const result = executeCalculation(
      defineCalculation({
        name: "trace-sequence-test",
        calculate: (_input, context) => {
          context.trace.add({
            id: "step-1",
            name: "First Step",
          });

          context.trace.add({
            id: "step-2",
            name: "Second Step",
          });

          return {};
        },
      }),
      {},
      {
        calculationId: "calc-trace-sequence",
        startedAt: "2026-01-01T00:00:00.000Z",
      },
    );

    expect(result.trace.steps).toHaveLength(2);
    expect(result.trace.steps[0]?.sequence).toBe(1);
    expect(result.trace.steps[1]?.sequence).toBe(2);
  });

});
