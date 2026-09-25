import type { PvArrayInput } from "../types/pv-array-input.js";

export interface PvArrayVoltageResult {
  readonly arrayVmpV: number;
  readonly arrayVocV: number;
}

export function calculateArrayVoltage(
  input: PvArrayInput,
): PvArrayVoltageResult {
  return {
    arrayVmpV:
      input.moduleVmpV *
      input.modulesPerString,

    arrayVocV:
      input.moduleVocV *
      input.modulesPerString,
  };
}