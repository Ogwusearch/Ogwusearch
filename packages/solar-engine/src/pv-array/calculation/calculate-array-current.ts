import type { PvArrayInput } from "../types/pv-array-input.js";

export interface PvArrayCurrentResult {
  readonly arrayImpA: number;
  readonly arrayIscA: number;
}

export function calculateArrayCurrent(
  input: PvArrayInput,
): PvArrayCurrentResult {
  return {
    arrayImpA:
      input.moduleImpA *
      input.parallelStrings,

    arrayIscA:
      input.moduleIscA *
      input.parallelStrings,
  };
}