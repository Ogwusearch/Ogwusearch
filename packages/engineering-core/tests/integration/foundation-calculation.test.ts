import { describe, expect, it } from "vitest";

import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import {
  AMPERE,
  VOLT,
  WATT,
  createQuantity,
  type Quantity,
} from "@ogwusearch/engineering-units";

import {
  createError,
} from "@ogwusearch/engineering-validation";

import {
  defineCalculation,
  executeCalculation,
} from "../../src/index.js";

interface PowerInput {
  readonly voltage: Quantity;
  readonly current: Quantity;
}

interface PowerOutput {
  readonly power: Quantity;
}

const powerCalculation = defineCalculation<
  PowerInput,
  PowerOutput
>({
  name: "foundation-dc-power",

  validate: (input) => {
    const issues = [];

    if (!Number.isFinite(input.voltage.value)) {
      issues.push(
        createError({
          code: "INVALID_VOLTAGE",
          message: "Voltage must be finite.",
          path: "voltage",
        }),
      );
    }

    if (!Number.isFinite(input.current.value)) {
      issues.push(
        createError({
          code: "INVALID_CURRENT",
          message: "Current must be finite.",
          path: "current",
        }),
      );
    }

    if (input.voltage.value <= 0) {
      issues.push(
        createError({
          code: "INVALID_VOLTAGE",
          message: "Voltage must be greater than zero.",
          path: "voltage",
        }),
      );
    }

    if (input.current.value <= 0) {
      issues.push(
        createError({
          code: "INVALID_CURRENT",
          message: "Current must be greater than zero.",
          path: "current",
        }),
      );
    }

    return issues;
  },

  assumptions: () => [
    {
      code: "DC_POWER_RELATIONSHIP",
      name: "DC Power Relationship",
      value: "P = V × I",
      description:
        "Power is calculated as voltage multiplied by current.",
    },
  ],

  calculate: (input, context) => {
    const powerW =
      input.voltage.value *
      input.current.value;

    context.trace.add({
      id: "dc-power",
      name: "DC Power",
      description:
        "Calculate electrical power from voltage and current.",
      formula: "P = V × I",
      inputs: {
        voltageV: input.voltage.value,
        currentA: input.current.value,
      },
      outputs: {
        powerW,
      },
      unit: "W",
    });

    return {
      power: createQuantity(
        powerW,
        WATT,
      ),
    };
  },
});

describe("foundation calculation integration", () => {
  it("composes types, units, validation, and core", () => {
    const input: PowerInput = {
      voltage: createQuantity(
        48,
        VOLT,
      ),
      current: createQuantity(
        10,
        AMPERE,
      ),
    };

    const result: CalculationResult<PowerOutput> =
      executeCalculation(
        powerCalculation,
        input,
        {
          calculationId:
            "foundation-power-48v-10a",
          startedAt:
            "2026-01-01T00:00:00.000Z",
          options: {
            deterministic: true,
          },
        },
      );

    expect(result.status).toBe("SUCCESS");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);

    expect(result.value?.power.value).toBe(480);
    expect(result.value?.power.unit).toBe(WATT);

    expect(result.assumptions).toHaveLength(1);
    expect(result.assumptions[0]?.code).toBe(
      "DC_POWER_RELATIONSHIP",
    );

    expect(result.trace.steps).toHaveLength(1);
    expect(result.trace.steps[0]?.id).toBe(
      "dc-power",
    );
    expect(result.trace.steps[0]?.sequence).toBe(1);
    expect(result.trace.steps[0]?.outputs).toEqual({
      powerW: 480,
    });

    expect(result.metadata).toBeDefined();
  });

  it("blocks invalid foundation input before calculation", () => {
    const result =
      executeCalculation(
        powerCalculation,
        {
          voltage: createQuantity(
            0,
            VOLT,
          ),
          current: createQuantity(
            10,
            AMPERE,
          ),
        },
        {
          calculationId:
            "foundation-power-invalid",
          startedAt:
            "2026-01-01T00:00:00.000Z",
          options: {
            deterministic: true,
          },
        },
      );

    expect(result.status).toBe("ERROR");
    expect(result.valid).toBe(false);

    expect(result.value).toBeUndefined();

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.code).toBe(
      "INVALID_VOLTAGE",
    );
    expect(result.errors[0]?.path).toBe(
      "voltage",
    );

    expect(result.trace.steps).toEqual([]);
  });

  it("produces deterministic results for identical inputs", () => {
    const input: PowerInput = {
      voltage: createQuantity(
        48,
        VOLT,
      ),
      current: createQuantity(
        10,
        AMPERE,
      ),
    };

    const executionContext = {
      startedAt:
        "2026-01-01T00:00:00.000Z",
      options: {
        deterministic: true,
      },
    };

    const first =
      executeCalculation(
        powerCalculation,
        input,
        {
          ...executionContext,
          calculationId:
            "foundation-power-deterministic",
        },
      );

    const second =
      executeCalculation(
        powerCalculation,
        input,
        {
          ...executionContext,
          calculationId:
            "foundation-power-deterministic",
        },
      );

    expect(first.status).toBe(
      second.status,
    );

    expect(first.valid).toBe(
      second.valid,
    );

    expect(first.value).toEqual(
      second.value,
    );

    expect(first.errors).toEqual(
      second.errors,
    );

    expect(first.warnings).toEqual(
      second.warnings,
    );

    expect(first.assumptions).toEqual(
      second.assumptions,
    );

    expect(first.trace).toEqual(
      second.trace,
    );
  });
});
