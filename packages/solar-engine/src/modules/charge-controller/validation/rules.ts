
import type { EngineeringIssue } from "@ogwusearch/engineering-types";

import type {
  ChargeControllerSizingInput,
} from "../types/index.js";

function error(
  code: string,
  path: string,
  message: string,
  actual?: unknown,
): EngineeringIssue {
  return {
    code,
    severity: "ERROR",
    message,
    path,
    ...(actual !== undefined
      ? { actual }
      : {}),
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

function validateOptionalPositive(
  value: unknown,
  path: string,
  code: string,
  message: string,
): EngineeringIssue[] {
  if (
    value !== undefined &&
    (!isFiniteNumber(value) || value <= 0)
  ) {
    return [
      error(
        code,
        path,
        message,
        value,
      ),
    ];
  }

  return [];
}

export function validatePVArrayPower(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  if (
    !isFiniteNumber(input.pvArrayPowerW) ||
    input.pvArrayPowerW <= 0
  ) {
    return [
      error(
        "INVALID_PV_ARRAY_POWER",
        "pvArrayPowerW",
        "PV array power must be greater than zero.",
        input.pvArrayPowerW,
      ),
    ];
  }

  return [];
}

export function validateBatteryVoltage(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  if (
    !isFiniteNumber(input.batteryVoltageV) ||
    input.batteryVoltageV <= 0
  ) {
    return [
      error(
        "INVALID_BATTERY_VOLTAGE",
        "batteryVoltageV",
        "Battery voltage must be greater than zero.",
        input.batteryVoltageV,
      ),
    ];
  }

  return [];
}

export function validateControllerEfficiency(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  if (
    !isFiniteNumber(input.controllerEfficiency) ||
    input.controllerEfficiency <= 0 ||
    input.controllerEfficiency > 1
  ) {
    return [
      error(
        "INVALID_CONTROLLER_EFFICIENCY",
        "controllerEfficiency",
        "Controller efficiency must be greater than 0 and no greater than 1.",
        input.controllerEfficiency,
      ),
    ];
  }

  return [];
}

export function validateSafetyMargin(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  if (
    !isFiniteNumber(input.safetyMargin) ||
    input.safetyMargin < 0
  ) {
    return [
      error(
        "INVALID_SAFETY_MARGIN",
        "safetyMargin",
        "Safety margin cannot be negative.",
        input.safetyMargin,
      ),
    ];
  }

  return [];
}

export function validatePVArrayVoltages(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  return [
    ...validateOptionalPositive(
      input.pvArrayVmpV,
      "pvArrayVmpV",
      "INVALID_PV_ARRAY_VMP",
      "PV array Vmp must be greater than zero.",
    ),

    ...validateOptionalPositive(
      input.pvArrayVocV,
      "pvArrayVocV",
      "INVALID_PV_ARRAY_VOC",
      "PV array Voc must be greater than zero.",
    ),
  ];
}

export function validatePVArrayCurrents(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  return [
    ...validateOptionalPositive(
      input.pvArrayImpA,
      "pvArrayImpA",
      "INVALID_PV_ARRAY_IMP",
      "PV array Imp must be greater than zero.",
    ),

    ...validateOptionalPositive(
      input.pvArrayIscA,
      "pvArrayIscA",
      "INVALID_PV_ARRAY_ISC",
      "PV array Isc must be greater than zero.",
    ),
  ];
}

export function validatePVRelationships(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  if (
    input.pvArrayVmpV !== undefined &&
    input.pvArrayVocV !== undefined &&
    input.pvArrayVmpV > input.pvArrayVocV
  ) {
    issues.push(
      error(
        "INVALID_PV_VOLTAGE_RELATIONSHIP",
        "pvArrayVmpV",
        "PV array Vmp must not be greater than Voc.",
        input.pvArrayVmpV,
      ),
    );
  }

  if (
    input.pvArrayImpA !== undefined &&
    input.pvArrayIscA !== undefined &&
    input.pvArrayImpA > input.pvArrayIscA
  ) {
    issues.push(
      error(
        "INVALID_PV_CURRENT_RELATIONSHIP",
        "pvArrayImpA",
        "PV array Imp must not be greater than Isc.",
        input.pvArrayImpA,
      ),
    );
  }

  return issues;
}

export function validateControllerLimits(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  return [
    ...validateOptionalPositive(
      input.controllerRatedCurrentA,
      "controllerRatedCurrentA",
      "INVALID_CONTROLLER_RATED_CURRENT",
      "Controller rated current must be greater than zero.",
    ),

    ...validateOptionalPositive(
      input.controllerMaxPVVoltageV,
      "controllerMaxPVVoltageV",
      "INVALID_CONTROLLER_MAX_PV_VOLTAGE",
      "Controller maximum PV voltage must be greater than zero.",
    ),

    ...validateOptionalPositive(
      input.controllerMPPTMinVoltageV,
      "controllerMPPTMinVoltageV",
      "INVALID_MPPT_MIN_VOLTAGE",
      "Controller minimum MPPT voltage must be greater than zero.",
    ),

    ...validateOptionalPositive(
      input.controllerMPPTMaxVoltageV,
      "controllerMPPTMaxVoltageV",
      "INVALID_MPPT_MAX_VOLTAGE",
      "Controller maximum MPPT voltage must be greater than zero.",
    ),

    ...validateOptionalPositive(
      input.controllerMaxPVCurrentA,
      "controllerMaxPVCurrentA",
      "INVALID_CONTROLLER_MAX_PV_CURRENT",
      "Controller maximum PV input current must be greater than zero.",
    ),
  ];
}

export function validateMPPTRange(
  input: ChargeControllerSizingInput,
): EngineeringIssue[] {
  if (
    input.controllerMPPTMinVoltageV !== undefined &&
    input.controllerMPPTMaxVoltageV !== undefined &&
    input.controllerMPPTMinVoltageV >
      input.controllerMPPTMaxVoltageV
  ) {
    return [
      error(
        "INVALID_MPPT_VOLTAGE_RANGE",
        "controllerMPPTMinVoltageV",
        "Minimum MPPT voltage must not exceed maximum MPPT voltage.",
        input.controllerMPPTMinVoltageV,
      ),
    ];
  }

  return [];
}
