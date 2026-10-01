import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  CableInput,
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

export function validateCableInputRules(
  input: CableInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  if (
    input.mode !== "DC" &&
    input.mode !== "AC"
  ) {
    issues.push(
      error(
        "INVALID_CABLE_MODE",
        "Cable mode must be DC or AC.",
        "mode",
        input.mode,
      ),
    );
  }

  if (
    !Number.isFinite(input.designMargin) ||
    input.designMargin < 0 ||
    input.designMargin > 1
  ) {
    issues.push(
      error(
        "INVALID_DESIGN_MARGIN",
        "Design margin must be between 0 and 1.",
        "designMargin",
        input.designMargin,
      ),
    );
  }

  if (
    typeof input.conductorMaterial !==
      "string" ||
    input.conductorMaterial.trim() === ""
  ) {
    issues.push(
      error(
        "INVALID_CONDUCTOR_MATERIAL",
        "Conductor material must be a non-empty string.",
        "conductorMaterial",
        input.conductorMaterial,
      ),
    );
  }

  if (
    !Number.isInteger(
      input.conductorCount,
    ) ||
    input.conductorCount < 1
  ) {
    issues.push(
      error(
        "INVALID_CONDUCTOR_COUNT",
        "Conductor count must be an integer greater than or equal to 1.",
        "conductorCount",
        input.conductorCount,
      ),
    );
  }

  if (
    input.conductorOptions.length === 0
  ) {
    issues.push(
      error(
        "EMPTY_CONDUCTOR_OPTIONS",
        "At least one conductor option is required.",
        "conductorOptions",
      ),
    );
  }

  for (
    const [
      index,
      option,
    ] of input.conductorOptions.entries()
  ) {
    if (
      !isFiniteNumber(option.areaMm2) ||
      option.areaMm2 <= 0
    ) {
      issues.push(
        error(
          "INVALID_CONDUCTOR_OPTION_AREA",
          "Conductor option area must be greater than zero.",
          `conductorOptions[${index}].areaMm2`,
          option.areaMm2,
        ),
      );
    }

    if (
      !isFiniteNumber(
        option.allowableAmpacityA,
      ) ||
      option.allowableAmpacityA <= 0
    ) {
      issues.push(
        error(
          "INVALID_CONDUCTOR_OPTION_AMPACITY",
          "Conductor option allowable ampacity must be greater than zero.",
          `conductorOptions[${index}].allowableAmpacityA`,
          option.allowableAmpacityA,
        ),
      );
    }
  }

  if (
    input.loadPowerW !== undefined &&
    (
      !isFiniteNumber(input.loadPowerW) ||
      input.loadPowerW <= 0
    )
  ) {
    issues.push(
      error(
        "INVALID_LOAD_POWER",
        "Load power must be greater than zero.",
        "loadPowerW",
        input.loadPowerW,
      ),
    );
  }

  if (
    input.systemVoltageV !==
    undefined &&
    (
      !isFiniteNumber(
        input.systemVoltageV,
      ) ||
      input.systemVoltageV <= 0
    )
  ) {
    issues.push(
      error(
        "INVALID_SYSTEM_VOLTAGE",
        "System voltage must be greater than zero.",
        "systemVoltageV",
        input.systemVoltageV,
      ),
    );
  }

  if (
    input.operatingCurrentA !==
    undefined &&
    (
      !isFiniteNumber(
        input.operatingCurrentA,
      ) ||
      input.operatingCurrentA <= 0
    )
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
    input.cableLengthM !==
    undefined &&
    (
      !isFiniteNumber(
        input.cableLengthM,
      ) ||
      input.cableLengthM <= 0
    )
  ) {
    issues.push(
      error(
        "INVALID_CABLE_LENGTH",
        "Cable length must be greater than zero.",
        "cableLengthM",
        input.cableLengthM,
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
    input.powerFactor !== undefined &&
    (
      !isFiniteNumber(input.powerFactor) ||
      input.powerFactor <= 0 ||
      input.powerFactor > 1
    )
  ) {
    issues.push(
      error(
        "INVALID_POWER_FACTOR",
        "Power factor must be greater than 0 and less than or equal to 1.",
        "powerFactor",
        input.powerFactor,
      ),
    );
  }

  if (
    input.operatingCurrentA ===
      undefined &&
    input.loadPowerW === undefined
  ) {
    issues.push(
      error(
        "MISSING_CURRENT_INPUT",
        "Operating current or load power must be supplied.",
        "operatingCurrentA",
      ),
    );
  }

  if (
    input.operatingCurrentA ===
      undefined &&
    input.systemVoltageV === undefined
  ) {
    issues.push(
      error(
        "MISSING_SYSTEM_VOLTAGE",
        "System voltage is required when operating current is not supplied.",
        "systemVoltageV",
      ),
    );
  }

  if (
    input.mode === "AC" &&
    input.operatingCurrentA ===
      undefined &&
    input.powerFactor === undefined
  ) {
    issues.push(
      error(
        "MISSING_AC_POWER_FACTOR",
        "Power factor is required when AC current is derived from power and voltage.",
        "powerFactor",
      ),
    );
  }

  if (
    input.mode === "DC" &&
    input.powerFactor !== undefined
  ) {
    issues.push(
      error(
        "POWER_FACTOR_NOT_APPLICABLE",
        "Power factor must not be supplied for a DC current calculation.",
        "powerFactor",
        input.powerFactor,
      ),
    );
  }

  return issues;
}