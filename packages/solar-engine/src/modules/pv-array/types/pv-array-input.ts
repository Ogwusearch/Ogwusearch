import type { CalculationInput } from "@ogwusearch/engineering-types";

export interface PvArrayInput extends CalculationInput {
  readonly modulePowerW: number;
  readonly moduleVmpV: number;
  readonly moduleImpA: number;
  readonly moduleVocV: number;
  readonly moduleIscA: number;
  readonly modulesPerString: number;
  readonly parallelStrings: number;
  readonly maxArrayVoltageV?: number;
  readonly maxArrayCurrentA?: number;
  readonly maxArrayPowerW?: number;
}
