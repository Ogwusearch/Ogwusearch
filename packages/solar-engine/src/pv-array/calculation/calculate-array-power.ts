import type { PvArrayInput } from "../types/pv-array-input.js";

export function calculateArrayPower(
  input: PvArrayInput,
): number {
  const totalModules =
    input.modulesPerString *
    input.parallelStrings;

  return (
    input.modulePowerW *
    totalModules
  );
}