import {
  createError,
  PEAK_DEMAND_ERROR_CODES,
} from "./errors";

import type {
  EngineeringMessage,
  PeakDemandInput,
  PeakDemandLoad,
  ValidationResult,
} from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateLoad(
  load: unknown,
  index: number,
): EngineeringMessage[] {
  const errors: EngineeringMessage[] = [];

  const fieldPrefix = `loads[${index}]`;

  if (!isObject(load)) {
    errors.push(
      createError(
        PEAK_DEMAND_ERROR_CODES.INVALID_LOADS,
        fieldPrefix,
        "Load must be an object.",
        load,
      ),
    );

    return errors;
  }

  const name = load.name;

  if (
    typeof name !== "string" ||
    name.trim().length === 0
  ) {
    errors.push(
      createError(
        PEAK_DEMAND_ERROR_CODES.INVALID_LOAD_NAME,
        `${fieldPrefix}.name`,
        "Load name must be a non-empty string.",
        name,
      ),
    );
  }

  const quantity = load.quantity;

  if (!isFiniteNumber(quantity)) {
    errors.push(
      createError(
        Number.isNaN(quantity)
          ? PEAK_DEMAND_ERROR_CODES.NON_FINITE_VALUE
          : PEAK_DEMAND_ERROR_CODES.INVALID_QUANTITY,
        `${fieldPrefix}.quantity`,
        "Quantity must be a finite number.",
        quantity,
      ),
    );
  } else if (quantity <= 0) {
    errors.push(
      createError(
        PEAK_DEMAND_ERROR_CODES.INVALID_QUANTITY,
        `${fieldPrefix}.quantity`,
        "Quantity must be greater than zero.",
        quantity,
      ),
    );
  }

  const powerW = load.powerW;

  if (!isFiniteNumber(powerW)) {
    errors.push(
      createError(
        Number.isNaN(powerW)
          ? PEAK_DEMAND_ERROR_CODES.NON_FINITE_VALUE
          : PEAK_DEMAND_ERROR_CODES.INVALID_POWER,
        `${fieldPrefix}.powerW`,
        "Power must be a finite number.",
        powerW,
      ),
    );
  } else if (powerW <= 0) {
    errors.push(
      createError(
        PEAK_DEMAND_ERROR_CODES.INVALID_POWER,
        `${fieldPrefix}.powerW`,
        "Power must be greater than zero.",
        powerW,
      ),
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      load,
      "demandFactor",
    )
  ) {
    const demandFactor = load.demandFactor;

    if (!isFiniteNumber(demandFactor)) {
      errors.push(
        createError(
          Number.isNaN(demandFactor)
            ? PEAK_DEMAND_ERROR_CODES.NON_FINITE_VALUE
            : PEAK_DEMAND_ERROR_CODES.INVALID_DEMAND_FACTOR,
          `${fieldPrefix}.demandFactor`,
          "Demand factor must be a finite number.",
          demandFactor,
        ),
      );
    } else if (demandFactor < 0) {
      errors.push(
        createError(
          PEAK_DEMAND_ERROR_CODES.INVALID_DEMAND_FACTOR,
          `${fieldPrefix}.demandFactor`,
          "Demand factor must be greater than or equal to zero.",
          demandFactor,
        ),
      );
    }
  }

  return errors;
}

export function validatePeakDemandInput(
  input: unknown,
): ValidationResult {
  const errors: EngineeringMessage[] = [];
  const warnings: EngineeringMessage[] = [];

  if (!isObject(input)) {
    errors.push(
      createError(
        PEAK_DEMAND_ERROR_CODES.INVALID_INPUT,
        "input",
        "Peak demand input must be a non-null object.",
        input,
      ),
    );

    return {
      valid: false,
      errors,
      warnings,
    };
  }

  if (!Object.prototype.hasOwnProperty.call(input, "loads")) {
    errors.push(
      createError(
        PEAK_DEMAND_ERROR_CODES.INVALID_LOADS,
        "loads",
        "The loads field is required.",
      ),
    );

    return {
      valid: false,
      errors,
      warnings,
    };
  }

  const loads = input.loads;

  if (!Array.isArray(loads)) {
    errors.push(
      createError(
        PEAK_DEMAND_ERROR_CODES.INVALID_LOADS,
        "loads",
        "Loads must be an array.",
        loads,
      ),
    );

    return {
      valid: false,
      errors,
      warnings,
    };
  }

  if (loads.length === 0) {
    errors.push(
      createError(
        PEAK_DEMAND_ERROR_CODES.EMPTY_LOADS,
        "loads",
        "At least one electrical load is required.",
      ),
    );

    return {
      valid: false,
      errors,
      warnings,
    };
  }

  loads.forEach((load, index) => {
    errors.push(...validateLoad(load, index));
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Type guard used after structural validation.
 */
export function isPeakDemandInput(
  input: unknown,
): input is PeakDemandInput {
  if (!isObject(input) || !Array.isArray(input.loads)) {
    return false;
  }

  return input.loads.every(
    (load): load is PeakDemandLoad =>
      isObject(load) &&
      typeof load.name === "string" &&
      isFiniteNumber(load.quantity) &&
      isFiniteNumber(load.powerW) &&
      (
        load.demandFactor === undefined ||
        isFiniteNumber(load.demandFactor)
      ),
  );
}