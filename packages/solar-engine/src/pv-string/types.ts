import type { EngineeringMetadata } from "@ogwusearch/engineering-types";

export interface PvStringInput {
  modulePowerW: number;
  moduleVmpV: number;
  moduleImpA: number;
  moduleVocV: number;
  moduleIscA: number;
  modulesPerString: number;
  maxStringVoltageV?: number;
}

export interface PvStringOutput {
  modulesPerString: number;
  stringVmpV: number;
  stringImpA: number;
  stringVocV: number;
  stringIscA: number;
  stringPowerW: number;
}

export interface PvStringCalculationContext {
  metadata?: EngineeringMetadata;
}