import type { CalculationOutput } from "@ogwusearch/engineering-types";

export interface PvArrayOutput extends CalculationOutput {
  readonly totalModules: number;
  readonly modulesPerString: number;
  readonly parallelStrings: number;
  readonly arrayPowerW: number;
  readonly arrayVmpV: number;
  readonly arrayImpA: number;
  readonly arrayVocV: number;
  readonly arrayIscA: number;
}
