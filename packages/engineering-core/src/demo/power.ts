import type {
  EngineeringIssue,
  EngineeringMetadata,
} from "@ogwusearch/engineering-types";

import {
  createQuantity,
  dimensionsEqual,
  multiplyDimensions,
  VOLT,
  AMPERE,
  WATT,
  VOLTAGE,
  CURRENT,
  POWER,
} from "@ogwusearch/engineering-units";

import {
  combineIssues,
  numeric,
  positive,
  validate,
} from "@ogwusearch/engineering-validation";
export interface PowerCalculationInput {
  readonly voltage: number;
  readonly current: number;
}

export interface PowerTraceStep {
  readonly step: number;
  readonly operation: string;
  readonly value: number | string;
  readonly unit?: string;
}

export interface PowerCalculationResult {
  readonly value: number;
  readonly unit: typeof WATT;
  readonly issues: readonly EngineeringIssue[];
  readonly trace: readonly PowerTraceStep[];
  readonly metadata: EngineeringMetadata;
}

export function calculatePowerDemo(
  input: PowerCalculationInput,
): PowerCalculationResult {
  const voltageQuantity = createQuantity(
    input.voltage,
    VOLT,
  );

  const currentQuantity = createQuantity(
    input.current,
    AMPERE,
  );

  const voltageIssues = validate(
    voltageQuantity.value,
    [numeric(), positive()],
    { path: "voltage" },
  );

  const currentIssues = validate(
    currentQuantity.value,
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
          operation: "validate",
          value: "Validation failed",
        },
      ],
      metadata: {
        module: "engineering-core/demo-power",
        version: "0.1.0",
        extras: {
          domain: "generic-electrical",
        },
      },
    };
  }

  if (
    !dimensionsEqual(
      voltageQuantity.unit.dimension,
      VOLTAGE,
    )
  ) {
    throw new Error(
      "Voltage input does not have voltage dimensions.",
    );
  }

  if (
    !dimensionsEqual(
      currentQuantity.unit.dimension,
      CURRENT,
    )
  ) {
    throw new Error(
      "Current input does not have current dimensions.",
    );
  }

  const resultDimension = multiplyDimensions(
    voltageQuantity.unit.dimension,
    currentQuantity.unit.dimension,
  );

  if (!dimensionsEqual(resultDimension, POWER)) {
    throw new Error(
      "Voltage × current did not produce a power dimension.",
    );
  }

  const voltageBase =
    voltageQuantity.unit.toBase(
      voltageQuantity.value,
    );

  const currentBase =
    currentQuantity.unit.toBase(
      currentQuantity.value,
    );

  const powerWatts =
    voltageBase * currentBase;

  return {
    value: powerWatts,
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
        operation: "multiply voltage × current",
        value: powerWatts,
        unit: "W",
      },
    ],
    metadata: {
      module: "engineering-core/demo-power",
      version: "0.1.0",
      extras: {
        formula: "P = V × I",
        domain: "generic-electrical",
      },
    },
  };
}