import { describe, expect, it } from "vitest";

import type {
  EngineeringMetadata,
  EngineeringResult,
} from "@ogwusearch/engineering-types";

import type { EngineeringModule } from "../module";
import { runEngineeringModule } from "../runner";

interface TestInput {
  value: number;
}

interface ValidatedTestInput extends TestInput {
  value: number;
}

interface TestOutput {
  doubled: number;
}

const metadata: EngineeringMetadata = {
  engineVersion: "0.1.0",
  calculationVersion: "0.1.0",
  moduleVersion: "0.1.0",
  calculatedAt: "2026-01-01T00:00:00.000Z",
};

const testModule: EngineeringModule<
  TestInput,
  ValidatedTestInput,
  TestOutput
> = {
  validate(input) {
    if (input.value < 0) {
      return {
        valid: false,
        errors: [
          {
            code: "NEGATIVE_VALUE",
            field: "value",
            message:
              "Value must be greater than or equal to zero.",
            severity: "error",
          },
        ],
        warnings: [],
      };
    }

    return {
      valid: true,
      errors: [],
      warnings: [],
    };
  },

  calculate(input) {
    return {
      value: {
        doubled: input.value * 2,
      },

      trace: {
        formulas: [
          {
            id: "double-value",
            name: "Double Value",
            expression: "doubled = value × 2",
          },
        ],

        assumptions: [],

        intermediateValues: [
          {
            name: "Input Value",
            value: input.value,
          },
          {
            name: "Doubled Value",
            value: input.value * 2,
          },
        ],

        constants: [],
        steps: [],
      },
    };
  },
};

describe("runEngineeringModule", () => {
  it("calculates a valid input", () => {
    const result: EngineeringResult<TestOutput> =
      runEngineeringModule(
        { value: 10 },
        testModule,
        metadata,
      );

    expect(result.success).toBe(true);

    expect(result.value).toEqual({
      doubled: 20,
    });

    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);

    expect(result.trace).toBeDefined();
    expect(result.trace?.formulas).toHaveLength(1);

    expect(result.metadata).toEqual(metadata);
  });

  it("returns validation errors for invalid input", () => {
    const result: EngineeringResult<TestOutput> =
      runEngineeringModule(
        { value: -5 },
        testModule,
        metadata,
      );

    expect(result.success).toBe(false);

    expect(result.errors).toHaveLength(1);

    expect(result.errors[0]?.code).toBe(
      "NEGATIVE_VALUE",
    );

    expect(result.value).toBeUndefined();

    expect(result.metadata).toEqual(metadata);
  });

  it("uses default metadata when metadata is not provided", () => {
    const result = runEngineeringModule(
      { value: 5 },
      testModule,
    );

    expect(result.success).toBe(true);

    expect(result.value).toEqual({
      doubled: 10,
    });

    expect(result.metadata).toMatchObject({
      engineVersion: "0.1.0",
      calculationVersion: "0.1.0",
      moduleVersion: "0.1.0",
    });

    expect(result.metadata.calculatedAt).toEqual(
      expect.any(String),
    );
  });

  it("preserves calculation trace", () => {
    const result = runEngineeringModule(
      { value: 7 },
      testModule,
      metadata,
    );

    expect(result.success).toBe(true);

    expect(result.trace).toBeDefined();

    expect(result.trace?.formulas).toEqual([
      {
        id: "double-value",
        name: "Double Value",
        expression: "doubled = value × 2",
      },
    ]);

    expect(
      result.trace?.intermediateValues,
    ).toEqual([
      {
        name: "Input Value",
        value: 7,
      },
      {
        name: "Doubled Value",
        value: 14,
      },
    ]);
  });

  it("does not execute calculation when validation fails", () => {
    let calculationCalled = false;

    const module: EngineeringModule<
      TestInput,
      ValidatedTestInput,
      TestOutput
    > = {
      validate() {
        return {
          valid: false,
          errors: [
            {
              code: "INVALID_INPUT",
              field: "value",
              message: "Invalid input.",
              severity: "error",
            },
          ],
          warnings: [],
        };
      },

      calculate(input) {
        calculationCalled = true;

        return {
          value: {
            doubled: input.value * 2,
          },

          trace: {
            formulas: [],
            assumptions: [],
            intermediateValues: [],
            constants: [],
            steps: [],
          },
        };
      },
    };

    const result = runEngineeringModule(
      { value: 10 },
      module,
      metadata,
    );

    expect(result.success).toBe(false);
    expect(calculationCalled).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
