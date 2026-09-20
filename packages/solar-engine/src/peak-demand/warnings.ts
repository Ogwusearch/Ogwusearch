import type {
  EngineeringMessage,
  PeakDemandInput,
  PeakDemandValue,
} from "./types";

export const PEAK_DEMAND_WARNING_CODES = {
  DEFAULT_DEMAND_FACTOR: "DEFAULT_DEMAND_FACTOR",
} as const;

export type PeakDemandWarningCode =
  (typeof PEAK_DEMAND_WARNING_CODES)[keyof typeof PEAK_DEMAND_WARNING_CODES];

export function createWarning(
  code: PeakDemandWarningCode,
  field: string,
  message: string,
  value?: unknown,
): EngineeringMessage {
  const warning: EngineeringMessage = {
    code,
    field,
    message,
  };

  if (value !== undefined) {
    warning.value = value;
  }

  return warning;
}

export function generateWarnings(
  input: PeakDemandInput,
  _value: PeakDemandValue,
): EngineeringMessage[] {
  const warnings: EngineeringMessage[] = [];

  input.loads.forEach((load, index) => {
    if (load.demandFactor === undefined) {
      warnings.push(
        createWarning(
          PEAK_DEMAND_WARNING_CODES.DEFAULT_DEMAND_FACTOR,
          `loads[${index}].demandFactor`,
          "No demand factor supplied; 100% demand assumed.",
          1,
        ),
      );
    }
  });

  return warnings;
}