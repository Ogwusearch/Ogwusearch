import type { ValidationResult } from "@ogwusearch/engineering-validation";

import { PV_STRING_CONSTANTS } from "./constants";
import { PV_STRING_ERROR_CODES } from "./errors";
import type { PvStringInput } from "./types";
import { PV_STRING_WARNING_CODES } from "./warnings";

export function validatePvStringInput(
  input: PvStringInput,
): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  const addError = (
    code: string,
    message: string,
    field: string,
    value?: unknown,
  ): void => {
    errors.push({
      code,
      field,
      message,
      ...(value !== undefined ? { value } : {}),
      severity: "error",
    });
  };

  const addWarning = (
    code: string,
    message: string,
    field: string,
    value?: unknown,
  ): void => {
    warnings.push({
      code,
      field,
      message,
      ...(value !== undefined ? { value } : {}),
      severity: "warning",
    });
  };

  if (!Number.isFinite(input.modulePowerW)) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_POWER,
      "Module power must be a finite number.",
      "modulePowerW",
      input.modulePowerW,
    );
  } else if (
    input.modulePowerW <= PV_STRING_CONSTANTS.minModulePowerW
  ) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_POWER,
      "Module power must be greater than zero.",
      "modulePowerW",
      input.modulePowerW,
    );
  }

  if (!Number.isFinite(input.moduleVmpV)) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_VMP,
      "Module Vmp must be a finite number.",
      "moduleVmpV",
      input.moduleVmpV,
    );
  } else if (
    input.moduleVmpV <= PV_STRING_CONSTANTS.minModuleVoltageV
  ) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_VMP,
      "Module Vmp must be greater than zero.",
      "moduleVmpV",
      input.moduleVmpV,
    );
  }

  if (!Number.isFinite(input.moduleImpA)) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_IMP,
      "Module Imp must be a finite number.",
      "moduleImpA",
      input.moduleImpA,
    );
  } else if (
    input.moduleImpA <= PV_STRING_CONSTANTS.minModuleCurrentA
  ) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_IMP,
      "Module Imp must be greater than zero.",
      "moduleImpA",
      input.moduleImpA,
    );
  }

  if (!Number.isFinite(input.moduleVocV)) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_VOC,
      "Module Voc must be a finite number.",
      "moduleVocV",
      input.moduleVocV,
    );
  } else if (
    input.moduleVocV <= PV_STRING_CONSTANTS.minModuleVoltageV
  ) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_VOC,
      "Module Voc must be greater than zero.",
      "moduleVocV",
      input.moduleVocV,
    );
  }

  if (!Number.isFinite(input.moduleIscA)) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_ISC,
      "Module Isc must be a finite number.",
      "moduleIscA",
      input.moduleIscA,
    );
  } else if (
    input.moduleIscA <= PV_STRING_CONSTANTS.minModuleCurrentA
  ) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULE_ISC,
      "Module Isc must be greater than zero.",
      "moduleIscA",
      input.moduleIscA,
    );
  }

  if (!Number.isInteger(input.modulesPerString)) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULES_PER_STRING,
      "Modules per string must be an integer.",
      "modulesPerString",
      input.modulesPerString,
    );
  } else if (
    input.modulesPerString <
    PV_STRING_CONSTANTS.minModulesPerString
  ) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MODULES_PER_STRING,
      "Modules per string must be at least one.",
      "modulesPerString",
      input.modulesPerString,
    );
  }

  if (
    input.maxStringVoltageV !== undefined &&
    (!Number.isFinite(input.maxStringVoltageV) ||
      input.maxStringVoltageV <=
        PV_STRING_CONSTANTS.minModuleVoltageV)
  ) {
    addError(
      PV_STRING_ERROR_CODES.INVALID_MAX_STRING_VOLTAGE,
      "Maximum string voltage must be greater than zero.",
      "maxStringVoltageV",
      input.maxStringVoltageV,
    );
  }

  if (
    Number.isFinite(input.moduleVmpV) &&
    Number.isFinite(input.moduleVocV) &&
    input.moduleVmpV > 0 &&
    input.moduleVocV > 0 &&
    input.moduleVmpV > input.moduleVocV
  ) {
    addError(
      PV_STRING_ERROR_CODES.VMP_EXCEEDS_VOC,
      "Module Vmp cannot be greater than module Voc.",
      "moduleVmpV",
      input.moduleVmpV,
    );
  }

  if (
    Number.isFinite(input.moduleImpA) &&
    Number.isFinite(input.moduleIscA) &&
    input.moduleImpA > 0 &&
    input.moduleIscA > 0 &&
    input.moduleImpA > input.moduleIscA
  ) {
    addError(
      PV_STRING_ERROR_CODES.IMP_EXCEEDS_ISC,
      "Module Imp cannot be greater than module Isc.",
      "moduleImpA",
      input.moduleImpA,
    );
  }

  const hasValidSeries =
    Number.isInteger(input.modulesPerString) &&
    input.modulesPerString >=
      PV_STRING_CONSTANTS.minModulesPerString;

  if (
    hasValidSeries &&
    Number.isFinite(input.moduleVocV) &&
    input.moduleVocV > 0 &&
    input.maxStringVoltageV !== undefined &&
    input.maxStringVoltageV > 0
  ) {
    const stringVocV =
      input.moduleVocV * input.modulesPerString;

    if (stringVocV > input.maxStringVoltageV) {
      addError(
        PV_STRING_ERROR_CODES.VOC_EXCEEDS_LIMIT,
        "PV string open-circuit voltage exceeds the configured maximum.",
        "maxStringVoltageV",
        input.maxStringVoltageV,
      );
    }
  }

  if (
    hasValidSeries &&
    input.modulesPerString === 1 &&
    PV_STRING_WARNING_CODES.SINGLE_MODULE_STRING
  ) {
    addWarning(
      PV_STRING_WARNING_CODES.SINGLE_MODULE_STRING,
      "The PV string uses only one module.",
      "modulesPerString",
      input.modulesPerString,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}