
import type { InverterSizingInput } from "../types";

/**
 * Returns the engineering assumptions applicable to
 * the supplied inverter sizing input.
 *
 * This function does not perform calculations or validation.
 * It only documents the assumptions used by the calculation.
 */
export function getInverterSizingAssumptions(
  input: InverterSizingInput,
): string[] {
  const assumptions: string[] = [
    "Continuous AC output requirement is based on the continuous connected load.",
    "Surge AC output requirement is based on the expected startup or transient load.",
    "Inverter efficiency is represented as a decimal fraction.",
    "DC input power accounts for inverter efficiency.",
    "DC input current is calculated from DC input power and system voltage.",
  ];

  if (input.powerFactor !== undefined) {
    assumptions.push(
      "Continuous apparent power is calculated from continuous load and the supplied power factor.",
    );
  }

  if (input.inverterRatedPowerW !== undefined) {
    assumptions.push(
      "Continuous inverter compatibility is evaluated against the supplied inverter continuous rating.",
    );
  }

  if (input.inverterSurgePowerW !== undefined) {
    assumptions.push(
      "Surge inverter compatibility is evaluated against the supplied inverter surge rating.",
    );
  }

  if (
    input.inverterInputVoltageMinV !== undefined &&
    input.inverterInputVoltageMaxV !== undefined
  ) {
    assumptions.push(
      "DC input voltage compatibility is evaluated against the supplied inverter input voltage range.",
    );
  }

  if (
    input.requiredOutputVoltageV !== undefined &&
    input.inverterOutputVoltageV !== undefined
  ) {
    assumptions.push(
      "AC output voltage compatibility is evaluated by comparing the required and inverter output voltages.",
    );
  }

  return assumptions;
}