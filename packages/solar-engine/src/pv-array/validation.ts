import type { ValidationResult } from "@ogwusearch/engineering-validation";

import { PV_ARRAY_CONSTANTS } from "./constants";
import { PV_ARRAY_ERROR_CODES } from "./errors";
import type { PvArrayInput } from "./types";
import { PV_ARRAY_WARNING_CODES } from "./warnings";

export function validatePvArrayInput(
  input: PvArrayInput,
): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  const addError = (
    code: string,
    message: string,
    field: string,
  ): void => {
    errors.push({
      code,
      message,
      field,
      severity: "error",
    });
  };

  const addWarning = (
    code: string,
    message: string,
    field: string,
  ): void => {
    warnings.push({
      code,
      message,
      field,
      severity: "warning",
    });
  };

  if (!Number.isFinite(input.modulePowerW)) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_POWER,
      "Module power must be a finite number.",
      "modulePowerW",
    );
  } else if (
    input.modulePowerW <= PV_ARRAY_CONSTANTS.minModulePowerW
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_POWER,
      "Module power must be greater than zero.",
      "modulePowerW",
    );
  }

  if (!Number.isFinite(input.moduleVmpV)) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_VMP,
      "Module Vmp must be a finite number.",
      "moduleVmpV",
    );
  } else if (
    input.moduleVmpV <= PV_ARRAY_CONSTANTS.minModuleVoltageV
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_VMP,
      "Module Vmp must be greater than zero.",
      "moduleVmpV",
    );
  }

  if (!Number.isFinite(input.moduleImpA)) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_IMP,
      "Module Imp must be a finite number.",
      "moduleImpA",
    );
  } else if (
    input.moduleImpA <= PV_ARRAY_CONSTANTS.minModuleCurrentA
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_IMP,
      "Module Imp must be greater than zero.",
      "moduleImpA",
    );
  }

  if (!Number.isFinite(input.moduleVocV)) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_VOC,
      "Module Voc must be a finite number.",
      "moduleVocV",
    );
  } else if (
    input.moduleVocV <= PV_ARRAY_CONSTANTS.minModuleVoltageV
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_VOC,
      "Module Voc must be greater than zero.",
      "moduleVocV",
    );
  }

  if (!Number.isFinite(input.moduleIscA)) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_ISC,
      "Module Isc must be a finite number.",
      "moduleIscA",
    );
  } else if (
    input.moduleIscA <= PV_ARRAY_CONSTANTS.minModuleCurrentA
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULE_ISC,
      "Module Isc must be greater than zero.",
      "moduleIscA",
    );
  }

  if (!Number.isInteger(input.modulesPerString)) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULES_PER_STRING,
      "Modules per string must be an integer.",
      "modulesPerString",
    );
  } else if (
    input.modulesPerString <
    PV_ARRAY_CONSTANTS.minModulesPerString
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MODULES_PER_STRING,
      "Modules per string must be at least one.",
      "modulesPerString",
    );
  }

  if (!Number.isInteger(input.parallelStrings)) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_PARALLEL_STRINGS,
      "Parallel strings must be an integer.",
      "parallelStrings",
    );
  } else if (
    input.parallelStrings <
    PV_ARRAY_CONSTANTS.minParallelStrings
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_PARALLEL_STRINGS,
      "Parallel strings must be at least one.",
      "parallelStrings",
    );
  }

  if (
    input.maxArrayVoltageV !== undefined &&
    (!Number.isFinite(input.maxArrayVoltageV) ||
      input.maxArrayVoltageV <= 0)
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MAX_VOLTAGE,
      "Maximum array voltage must be greater than zero.",
      "maxArrayVoltageV",
    );
  }

  if (
    input.maxArrayCurrentA !== undefined &&
    (!Number.isFinite(input.maxArrayCurrentA) ||
      input.maxArrayCurrentA <= 0)
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MAX_CURRENT,
      "Maximum array current must be greater than zero.",
      "maxArrayCurrentA",
    );
  }

  if (
    input.maxArrayPowerW !== undefined &&
    (!Number.isFinite(input.maxArrayPowerW) ||
      input.maxArrayPowerW <= 0)
  ) {
    addError(
      PV_ARRAY_ERROR_CODES.INVALID_MAX_POWER,
      "Maximum array power must be greater than zero.",
      "maxArrayPowerW",
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
      PV_ARRAY_ERROR_CODES.VMP_EXCEEDS_VOC,
      "Module Vmp cannot be greater than module Voc.",
      "moduleVmpV",
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
      PV_ARRAY_ERROR_CODES.IMP_EXCEEDS_ISC,
      "Module Imp cannot be greater than module Isc.",
      "moduleImpA",
    );
  }

  const hasValidSeries =
    Number.isInteger(input.modulesPerString) &&
    input.modulesPerString >=
      PV_ARRAY_CONSTANTS.minModulesPerString;

  const hasValidParallel =
    Number.isInteger(input.parallelStrings) &&
    input.parallelStrings >=
      PV_ARRAY_CONSTANTS.minParallelStrings;

  if (
    hasValidSeries &&
    Number.isFinite(input.moduleVocV) &&
    input.moduleVocV > 0 &&
    input.maxArrayVoltageV !== undefined &&
    input.maxArrayVoltageV > 0
  ) {
    const arrayVocV =
      input.moduleVocV * input.modulesPerString;

    if (arrayVocV > input.maxArrayVoltageV) {
      addError(
        PV_ARRAY_ERROR_CODES.VOC_EXCEEDS_LIMIT,
        "PV array open-circuit voltage exceeds the configured maximum.",
        "maxArrayVoltageV",
      );
    }
  }

  if (
    hasValidParallel &&
    Number.isFinite(input.moduleIscA) &&
    input.moduleIscA > 0 &&
    input.maxArrayCurrentA !== undefined &&
    input.maxArrayCurrentA > 0
  ) {
    const arrayIscA =
      input.moduleIscA * input.parallelStrings;

    if (arrayIscA > input.maxArrayCurrentA) {
      addError(
        PV_ARRAY_ERROR_CODES.ISC_EXCEEDS_LIMIT,
        "PV array short-circuit current exceeds the configured maximum.",
        "maxArrayCurrentA",
      );
    }
  }

  if (
    hasValidSeries &&
    hasValidParallel &&
    Number.isFinite(input.modulePowerW) &&
    input.modulePowerW > 0 &&
    input.maxArrayPowerW !== undefined &&
    input.maxArrayPowerW > 0
  ) {
    const totalModules =
      input.modulesPerString * input.parallelStrings;

    const arrayPowerW =
      input.modulePowerW * totalModules;

    if (arrayPowerW > input.maxArrayPowerW) {
      addError(
        PV_ARRAY_ERROR_CODES.POWER_EXCEEDS_LIMIT,
        "PV array power exceeds the configured maximum.",
        "maxArrayPowerW",
      );
    }
  }

  if (
    hasValidSeries &&
    input.modulesPerString === 1
  ) {
    addWarning(
      PV_ARRAY_WARNING_CODES.SINGLE_MODULE_STRING,
      "The PV array uses only one module per series string.",
      "modulesPerString",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}