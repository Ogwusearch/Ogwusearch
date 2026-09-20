import type { EngineeringMessage } from "./types";

export const PEAK_DEMAND_ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  INVALID_LOADS: "INVALID_LOADS",
  EMPTY_LOADS: "EMPTY_LOADS",
  INVALID_LOAD_NAME: "INVALID_LOAD_NAME",
  INVALID_QUANTITY: "INVALID_QUANTITY",
  INVALID_POWER: "INVALID_POWER",
  INVALID_DEMAND_FACTOR: "INVALID_DEMAND_FACTOR",
  NON_FINITE_VALUE: "NON_FINITE_VALUE",
} as const;

export type PeakDemandErrorCode =
  (typeof PEAK_DEMAND_ERROR_CODES)[keyof typeof PEAK_DEMAND_ERROR_CODES];

export function createError(
  code: PeakDemandErrorCode,
  field: string,
  message: string,
  value?: unknown,
): EngineeringMessage {
  const error: EngineeringMessage = {
    code,
    field,
    message,
  };

  if (value !== undefined) {
    error.value = value;
  }

  return error;
}