





/**
 * SolarAudit — Energy Engine
 *
 * Validates energy audit inputs before calculations are performed.
 *
 * This file must not contain:
 * - Calculation logic
 * - UI logic
 * - Database access
 * - API calls
 */

import type {
  EnergyError,
  EnergyInput,
  EnergyLoad,
  EnergyWarning,
} from "./types";

/* ============================================================
 * VALIDATION RESULT
 * ============================================================ */

export interface EnergyValidationResult {
  valid: boolean;
  warnings: EnergyWarning[];
  errors: EnergyError[];
}

/* ============================================================
 * LOAD VALIDATION
 * ============================================================ */

/**
 * Validate a single electrical load.
 */
export function validateEnergyLoad(
  load: EnergyLoad,
): EnergyValidationResult {
  const errors: EnergyError[] = [];
  const warnings: EnergyWarning[] = [];

  /* ----------------------------------------------------------
   * ID
   * -------------------------------------------------------- */

  if (!load.id.trim()) {
    errors.push({
      code: "INVALID_LOAD",
      message: "Load ID is required.",
      field: "id",
    });
  }

  /* ----------------------------------------------------------
   * NAME
   * -------------------------------------------------------- */

  if (!load.name.trim()) {
    errors.push({
      code: "INVALID_LOAD",
      message: "Load name is required.",
      field: "name",
      loadId: load.id,
    });
  }

  /* ----------------------------------------------------------
   * QUANTITY
   * -------------------------------------------------------- */

  if (!Number.isFinite(load.quantity)) {
    errors.push({
      code: "INVALID_QUANTITY",
      message: "Load quantity must be a finite number.",
      field: "quantity",
      loadId: load.id,
    });
  } else if (load.quantity <= 0) {
    errors.push({
      code: "INVALID_QUANTITY",
      message: "Load quantity must be greater than zero.",
      field: "quantity",
      loadId: load.id,
    });
  }

  /* ----------------------------------------------------------
   * POWER
   * -------------------------------------------------------- */

  if (!Number.isFinite(load.powerW)) {
    errors.push({
      code: "INVALID_POWER",
      message: "Load power must be a finite number.",
      field: "powerW",
      loadId: load.id,
    });
  } else if (load.powerW <= 0) {
    errors.push({
      code: "INVALID_POWER",
      message: "Load power must be greater than zero.",
      field: "powerW",
      loadId: load.id,
    });
  }

  /* ----------------------------------------------------------
   * OPERATING HOURS
   * -------------------------------------------------------- */

  if (!Number.isFinite(load.hoursPerDay)) {
    errors.push({
      code: "INVALID_OPERATING_HOURS",
      message: "Operating hours must be a finite number.",
      field: "hoursPerDay",
      loadId: load.id,
    });
  } else if (
    load.hoursPerDay < 0 ||
    load.hoursPerDay > 24
  ) {
    errors.push({
      code: "INVALID_OPERATING_HOURS",
      message: "Operating hours must be between 0 and 24 hours per day.",
      field: "hoursPerDay",
      loadId: load.id,
    });
  } else if (load.hoursPerDay === 0) {
    warnings.push({
      code: "ZERO_ENERGY_CONSUMPTION",
      message: "This load has zero operating hours and therefore consumes no daily energy.",
      loadId: load.id,
    });
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/* ============================================================
 * ENERGY INPUT VALIDATION
 * ============================================================ */

/**
 * Validate the complete energy audit input.
 */
export function validateEnergyInput(
  input: EnergyInput,
): EnergyValidationResult {
  const errors: EnergyError[] = [];
  const warnings: EnergyWarning[] = [];

  /* ----------------------------------------------------------
   * INPUT
   * -------------------------------------------------------- */

  if (!input) {
    return {
      valid: false,
      warnings: [],
      errors: [
        {
          code: "INVALID_INPUT",
          message: "Energy input is required.",
        },
      ],
    };
  }

  /* ----------------------------------------------------------
   * LOAD ARRAY
   * -------------------------------------------------------- */

  if (!Array.isArray(input.loads)) {
    return {
      valid: false,
      warnings: [],
      errors: [
        {
          code: "INVALID_INPUT",
          message: "Energy loads must be provided as an array.",
          field: "loads",
        },
      ],
    };
  }

  /* ----------------------------------------------------------
   * EMPTY LOADS
   * -------------------------------------------------------- */

  if (input.loads.length === 0) {
    errors.push({
      code: "NO_LOADS",
      message: "At least one electrical load is required.",
      field: "loads",
    });

    return {
      valid: false,
      warnings,
      errors,
    };
  }

  /* ----------------------------------------------------------
   * DUPLICATE LOAD IDS
   * -------------------------------------------------------- */

  const loadIds = new Set<string>();

  for (const load of input.loads) {
    if (loadIds.has(load.id)) {
      errors.push({
        code: "INVALID_LOAD",
        message: `Duplicate load ID "${load.id}".`,
        field: "id",
        loadId: load.id,
      });
    }

    loadIds.add(load.id);
  }

  /* ----------------------------------------------------------
   * VALIDATE EACH LOAD
   * -------------------------------------------------------- */

  for (const load of input.loads) {
    const result = validateEnergyLoad(load);

    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}