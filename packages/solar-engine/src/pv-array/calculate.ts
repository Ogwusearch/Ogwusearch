import type { PvArrayInput, PvArrayOutput } from "./types";

/**
 * Calculate the electrical characteristics of a PV array.
 *
 * PV array relationships:
 *
 * Total modules
 *   = modules per string × parallel strings
 *
 * Array Vmp
 *   = module Vmp × modules per string
 *
 * Array Imp
 *   = module Imp × parallel strings
 *
 * Array Voc
 *   = module Voc × modules per string
 *
 * Array Isc
 *   = module Isc × parallel strings
 *
 * Array power
 *   = module power × total modules
 *
 * This function assumes that the input has already passed
 * domain validation.
 */
export function calculatePvArray(
  input: PvArrayInput,
): PvArrayOutput {
  const {
    modulePowerW,
    moduleVmpV,
    moduleImpA,
    moduleVocV,
    moduleIscA,
    modulesPerString,
    parallelStrings,
  } = input;

  const totalModules =
    modulesPerString * parallelStrings;

  const arrayVmpV =
    moduleVmpV * modulesPerString;

  const arrayImpA =
    moduleImpA * parallelStrings;

  const arrayVocV =
    moduleVocV * modulesPerString;

  const arrayIscA =
    moduleIscA * parallelStrings;

  const arrayPowerW =
    modulePowerW * totalModules;

  return {
    totalModules,
    modulesPerString,
    parallelStrings,
    arrayVmpV,
    arrayImpA,
    arrayVocV,
    arrayIscA,
    arrayPowerW,
  };
}