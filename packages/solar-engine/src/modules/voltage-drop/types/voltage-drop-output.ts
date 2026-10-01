import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  VoltageDropMode,
} from "./voltage-drop-input.js";

export interface VoltageDropOutput {
  readonly mode: VoltageDropMode;

  readonly sourceVoltageV: number;

  readonly operatingCurrentA: number;

  readonly resistanceOhm: number;

  readonly voltageDropV: number;

  readonly voltageDropPercent: number;

  readonly loadVoltageV: number;

  readonly allowableVoltageDropPercent?: number;

  readonly withinAllowableLimit?: boolean;
}

export type VoltageDropResult =
  CalculationResult<VoltageDropOutput>;