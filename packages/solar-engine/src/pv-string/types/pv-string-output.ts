import type { CalculationOutput } from "@ogwusearch/engineering-types";

export interface PvStringOutput extends CalculationOutput {
  readonly modulesPerString: number;
  readonly stringVmpV: number;
  readonly stringImpA: number;
  readonly stringVocV: number;
  readonly stringIscA: number;
  readonly stringPowerW: number;
}
