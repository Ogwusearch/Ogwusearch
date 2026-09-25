import type {
  PvArrayInput,
  PvArrayOutput,
} from "./types/index.js";

import {
  calculateArrayCurrent,
  calculateArrayPower,
  calculateArrayVoltage,
} from "./calculation/index.js";

export function calculatePvArray(
  input: PvArrayInput,
): PvArrayOutput {
  const totalModules =
    input.modulesPerString *
    input.parallelStrings;

  const arrayPowerW =
    calculateArrayPower(input);

  const {
    arrayVmpV,
    arrayVocV,
  } = calculateArrayVoltage(input);

  const {
    arrayImpA,
    arrayIscA,
  } = calculateArrayCurrent(input);

  return {
    totalModules,
    modulesPerString:
      input.modulesPerString,
    parallelStrings:
      input.parallelStrings,
    arrayPowerW,
    arrayVmpV,
    arrayImpA,
    arrayVocV,
    arrayIscA,
  };
}