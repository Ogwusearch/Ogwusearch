// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/energy/errors.ts

export type EnergyErrorCode =
  | "INVALID_INPUT"
  | "INVALID_LOAD"
  | "INVALID_POWER"
  | "INVALID_QUANTITY"
  | "INVALID_OPERATING_HOURS"
  | "NEGATIVE_VALUE"
  | "NO_LOADS"
  | "CALCULATION_ERROR";

export interface EnergyError {
  code: EnergyErrorCode;
  message: string;
  severity: "error";
  field?: string | undefined;
  loadName?: string | undefined;
  value?: number | undefined;
}

export interface CreateEnergyErrorOptions {
  field?: string | undefined;
  loadName?: string | undefined;
  value?: number | undefined;
}

export function createEnergyError(
  code: EnergyErrorCode,
  message: string,
  options: CreateEnergyErrorOptions = {},
): EnergyError {
  const error: EnergyError = {
    code,
    message,
    severity: "error",
  };

  if (options.field !== undefined) {
    error.field = options.field;
  }

  if (options.loadName !== undefined) {
    error.loadName = options.loadName;
  }

  if (options.value !== undefined) {
    error.value = options.value;
  }

  return error;
}