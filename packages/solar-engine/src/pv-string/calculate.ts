import type {
  PvStringInput,
  PvStringOutput,
} from "./types";

/**
 * Calculate the electrical characteristics of a PV string.
 *
 * Series connection:
 * - Voltage adds.
 * - Current remains equal to the module current.
 * - Power adds.
 */
export function calculatePvString(
  input: PvStringInput,
): PvStringOutput {
  const {
    modulePowerW,
    moduleVmpV,
    moduleImpA,
    moduleVocV,
    moduleIscA,
    modulesPerString,
  } = input;

  return {
    modulesPerString,

    stringVmpV:
      moduleVmpV * modulesPerString,

    stringImpA:
      moduleImpA,

    stringVocV:
      moduleVocV * modulesPerString,

    stringIscA:
      moduleIscA,

    stringPowerW:
      modulePowerW * modulesPerString,
  };
}