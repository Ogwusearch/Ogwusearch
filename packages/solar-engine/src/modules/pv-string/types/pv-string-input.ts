import type { CalculationInput } from "@ogwusearch/engineering-types";

export interface PvStringInput extends CalculationInput {
  readonly modulePowerW: number;
  readonly moduleVmpV: number;
  readonly moduleImpA: number;
  readonly moduleVocV: number;
  readonly moduleIscA: number;
  readonly modulesPerString: number;
  readonly maxStringVoltageV?: number;
}
