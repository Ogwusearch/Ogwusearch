import { describe, expect, it } from "vitest";

import {
  AMPERE,
  CURRENT,
  IncompatibleUnitError,
  KILOVOLT,
  POWER,
  VOLT,
  VOLTAGE,
  WATT,
  convertValue,
  createQuantity,
  dimensionsEqual,
  multiplyDimensions,
} from "@ogwusearch/engineering-units";

import {
  combineIssues,
  numeric,
  positive,
  validate,
} from "@ogwusearch/engineering-validation";

import type {
  EngineeringIssue,
  EngineeringMetadata,
} from "@ogwusearch/engineering-types";

interface PowerInput {
  readonly voltage: number;
  readonly current: number;
}

interface TraceStep {
  readonly step: number;
  readonly operation: string;
  readonly value: number | string;
  readonly unit?: string;
}

interface PowerResult {
  readonly value: number;
  readonly unit: typeof WATT;
  readonly issues: readonly EngineeringIssue[];
  readonly trace: readonly TraceStep[];
  readonly metadata: EngineeringMetadata;
}

function calculatePower(
  input: PowerInput,
): PowerResult {
  const voltage = createQuantity(
    input.voltage,
    VOLT,
  );

  const current = createQuantity(
    input.current,
    AMPERE,
  );

  const voltageIssues = validate(
    voltage.value,
    [numeric(), positive()],
    { path: "voltage" },
  );

  const currentIssues = validate(
    current.value,
    [numeric(), positive()],
    { path: "current" },
  );

  const issues = combineIssues(
    voltageIssues,
    currentIssues,
  );

  if (issues.length > 0) {
    return {
      value: 0,
      unit: WATT,
      issues,
      trace: [
        {
          step: 1,
          operation: "validation",
          value: "failed",
        },
      ],
      metadata: {
        module: "engineering-core/integration",
        version: "0.1.0",
        extras: {
          formula: "P = V × I",
        },
      },
    };
  }

  if (
    !dimensionsEqual(
      voltage.unit.dimension,
      VOLTAGE,
    )
  ) {
    throw new Error(
      "Voltage quantity has an invalid dimension.",
    );
  }

  if (
    !dimensionsEqual(
      current.unit.dimension,
      CURRENT,
    )
  ) {
    throw new Error(
      "Current quantity has an invalid dimension.",
    );
  }

  const resultDimension = multiplyDimensions(
    voltage.unit.dimension,
    current.unit.dimension,
  );

  if (!dimensionsEqual(resultDimension, POWER)) {
    throw new Error(
      "Voltage × current did not produce power.",
    );
  }

  const voltageBase = convertValue(
    voltage.value,
    voltage.unit,
    VOLT,
  );

  const currentBase = convertValue(
    current.value,
    current.unit,
    AMPERE,
  );

  const watts = voltageBase * currentBase;

  return {
    value: watts,
    unit: WATT,
    issues: [],
    trace: [
      {
        step: 1,
        operation: "validate voltage",
        value: voltageBase,
        unit: "V",
      },
      {
        step: 2,
        operation: "validate current",
        value: currentBase,
        unit: "A",
      },
      {
        step: 3,
        operation: "P = V × I",
        value: watts,
        unit: "W",
      },
    ],
    metadata: {
      module: "engineering-core/integration",
      version: "0.1.0",
      extras: {
        formula: "P = V × I",
      },
    },
  };
}

describe("four-package engineering integration", () => {
  it("calculates 48 V × 10 A = 480 W", () => {
    const result = calculatePower({
      voltage: 48,
      current: 10,
    });

    expect(result.issues).toHaveLength(0);
    expect(result.value).toBe(480);
    expect(result.unit.symbol).toBe("W");

    expect(result.trace).toHaveLength(3);
    expect(result.trace[0]?.value).toBe(48);
    expect(result.trace[1]?.value).toBe(10);
    expect(result.trace[2]?.value).toBe(480);

    expect(result.metadata.module).toBe(
      "engineering-core/integration",
    );

    expect(
      result.metadata.extras?.formula,
    ).toBe("P = V × I");
  });

  it("collects validation issues", () => {
    const result = calculatePower({
      voltage: -48,
      current: 10,
    });

    expect(
      result.issues.length,
    ).toBeGreaterThan(0);

    expect(result.trace).toHaveLength(1);
    expect(result.trace[0]?.operation).toBe(
      "validation",
    );
  });

  it("allows conversion between compatible units", () => {
    const result = convertValue(
      230,
      VOLT,
      KILOVOLT,
    );

    expect(result).toBeCloseTo(0.23);
  });

  it("rejects conversion between incompatible units", () => {
    expect(() =>
      convertValue(
        48,
        VOLT,
        AMPERE,
      ),
    ).toThrow(IncompatibleUnitError);
  });

  it("reports the incompatible-dimension error code", () => {
    try {
      convertValue(
        48,
        VOLT,
        AMPERE,
      );

      throw new Error(
        "Expected incompatible unit conversion to fail.",
      );
    } catch (error) {
      expect(error).toBeInstanceOf(
        IncompatibleUnitError,
      );

      expect(
        (error as IncompatibleUnitError).code,
      ).toBe(
        "INCOMPATIBLE_UNIT_DIMENSIONS",
      );
    }
  });

  it("confirms voltage and current produce the power dimension", () => {
    const resultDimension = multiplyDimensions(
      VOLT.dimension,
      AMPERE.dimension,
    );

    expect(
      dimensionsEqual(
        resultDimension,
        POWER,
      ),
    ).toBe(true);
  });
});