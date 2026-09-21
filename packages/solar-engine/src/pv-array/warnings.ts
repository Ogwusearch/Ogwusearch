/**
 * PV Array validation warning codes.
 *
 * Warnings indicate conditions that do not make the calculation
 * invalid but may require engineering review.
 */

export const PV_ARRAY_WARNING_CODES = {
  SINGLE_MODULE_STRING:
    "PV_ARRAY_SINGLE_MODULE_STRING",
} as const;

export type PvArrayWarningCode =
  (typeof PV_ARRAY_WARNING_CODES)[keyof typeof PV_ARRAY_WARNING_CODES];