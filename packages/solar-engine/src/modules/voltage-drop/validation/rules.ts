import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  VoltageDropInput,
} from "../types/index.js";

function error(
  code: string,
  message: string,
  path: string,
  actual?: unknown,
): EngineeringIssue {
  return {
    code,
    severity: "ERROR",
    message,
    path,
    ...(actual !== undefined && {
      actual,
    }),
  };
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function validateVoltageDropInputRules(
  input: VoltageDropInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  if (
    input.mode !== "DC" &&
    input.mode !== "AC"
  ) {
    issues.push(
      error(
        "INVALID_VOLTAGE_DROP_MODE",
        "Voltage-drop mode must be DC or AC.",
        "mode",
        input.mode,
      ),
    );
  }

  if (
    !isFiniteNumber(
      input.sourceVoltageV,
    ) ||
    input.sourceVoltageV <= 0
  ) {
    issues.push(
      error(
        "INVALID_SOURCE_VOLTAGE",
        "Source voltage must be greater than zero.",
        "sourceVoltageV",
        input.sourceVoltageV,
      ),
    );
  }

  if (
    !isFiniteNumber(
      input.operatingCurrentA,
    ) ||
    input.operatingCurrentA <= 0
  ) {
    issues.push(
      error(
        "INVALID_OPERATING_CURRENT",
        "Operating current must be greater than zero.",
        "operatingCurrentA",
        input.operatingCurrentA,
      ),
    );
  }

  if (
    input.resistanceOhm !==
    undefined &&
    (
      !isFiniteNumber(
        input.resistanceOhm,
      ) ||
      input.resistanceOhm <= 0
    )
  ) {
    issues.push(
      error(
        "INVALID_RESISTANCE",
        "Resistance must be greater than zero.",
        "resistanceOhm",
        input.resistanceOhm,
      ),
    );
  }

  if (
    input.conductorLengthM !==
    undefined &&
    (
      !isFiniteNumber(
        input.conductorLengthM,
      ) ||
      input.conductorLengthM <= 0
    )
  ) {
    issues.push(
      error(
        "INVALID_CONDUCTOR_LENGTH",
        "Conductor length must be greater than zero.",
        "conductorLengthM",
        input.conductorLengthM,
      ),
    );
  }

  if (
    input.conductorAreaMm2 !==
    undefined &&
    (
      !isFiniteNumber(
        input.conductorAreaMm2,
      ) ||
      input.conductorAreaMm2 <= 0
    )
  ) {
    issues.push(
      error(
        "INVALID_CONDUCTOR_AREA",
        "Conductor area must be greater than zero.",
        "conductorAreaMm2",
        input.conductorAreaMm2,
      ),
    );
  }

  if (
    input.resistivityOhmMm2PerM !==
    undefined &&
    (
      !isFiniteNumber(
        input.resistivityOhmMm2PerM,
      ) ||
      input.resistivityOhmMm2PerM <= 0
    )
  ) {
    issues.push(
      error(
        "INVALID_RESISTIVITY",
        "Resistivity must be greater than zero.",
        "resistivityOhmMm2PerM",
        input.resistivityOhmMm2PerM,
      ),
    );
  }

  if (
    input.allowableVoltageDropPercent !==
    undefined &&
    (
      !isFiniteNumber(
        input.allowableVoltageDropPercent,
      ) ||
      input.allowableVoltageDropPercent < 0
    )
  ) {
    issues.push(
      error(
        "INVALID_ALLOWABLE_VOLTAGE_DROP",
        "Allowable voltage drop percentage must be zero or greater.",
        "allowableVoltageDropPercent",
        input.allowableVoltageDropPercent,
      ),
    );
  }

  const hasExplicitResistance =
    input.resistanceOhm !==
    undefined;

  const hasConductorModel =
    input.conductorLengthM !==
      undefined ||
    input.conductorAreaMm2 !==
      undefined ||
    input.resistivityOhmMm2PerM !==
      undefined;

  if (
    !hasExplicitResistance &&
    !hasConductorModel
  ) {
    issues.push(
      error(
        "MISSING_RESISTANCE_MODEL",
        "Either resistanceOhm or a complete conductor resistance model must be supplied.",
        "resistanceOhm",
      ),
    );
  }

  if (
    !hasExplicitResistance &&
    hasConductorModel
  ) {
    if (
      input.conductorLengthM ===
      undefined
    ) {
      issues.push(
        error(
          "MISSING_CONDUCTOR_LENGTH",
          "Conductor length is required when resistance is derived.",
          "conductorLengthM",
        ),
      );
    }

    if (
      input.conductorAreaMm2 ===
      undefined
    ) {
      issues.push(
        error(
          "MISSING_CONDUCTOR_AREA",
          "Conductor area is required when resistance is derived.",
          "conductorAreaMm2",
        ),
      );
    }

    if (
      input.resistivityOhmMm2PerM ===
      undefined
    ) {
      issues.push(
        error(
          "MISSING_RESISTIVITY",
          "Resistivity is required when resistance is derived.",
          "resistivityOhmMm2PerM",
        ),
      );
    }
  }

  return issues;
}