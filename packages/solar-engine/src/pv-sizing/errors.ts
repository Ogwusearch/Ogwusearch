/**
 * PV sizing validation error codes.
 *
 * These codes identify deterministic validation failures
 * specific to PV energy and power sizing inputs.
 */

export const PV_SIZING_ERROR_CODES = {
  INVALID_DAILY_ENERGY:
    "PV_SIZING_INVALID_DAILY_ENERGY",

  INVALID_PEAK_SUN_HOURS:
    "PV_SIZING_INVALID_PEAK_SUN_HOURS",

  INVALID_SYSTEM_EFFICIENCY:
    "PV_SIZING_INVALID_SYSTEM_EFFICIENCY",

  INVALID_PANEL_POWER:
    "PV_SIZING_INVALID_PANEL_POWER",
} as const;

export type PVSizingErrorCode =
  (typeof PV_SIZING_ERROR_CODES)[keyof typeof PV_SIZING_ERROR_CODES];