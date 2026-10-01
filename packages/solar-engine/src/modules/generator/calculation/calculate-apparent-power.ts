import type {
  GeneratorInput,
} from "../types/index.js";

/**
 * Calculate required apparent power.
 *
 * If upstream engineering has already supplied apparent power,
 * that value is authoritative and is returned unchanged.
 *
 * Otherwise:
 *
 *     S = P / PF
 *
 * where:
 *     S = apparent power [VA]
 *     P = real power [W]
 *     PF = power factor [-]
 */
export function calculateApparentPower(
  input: GeneratorInput,
): number {
  const supplied =
    input.requirement.requiredApparentPowerVA;

  if (supplied !== undefined) {
    return supplied;
  }

  const powerFactor =
    input.design?.powerFactor ??
    input.generator?.powerFactor ??
    1;

  return input.requirement.requiredPowerW / powerFactor;
}