import type {
  CalculationResult,
} from "@ogwusearch/engineering-types";

import type {
  CableMode,
} from "./cable-input.js";

export interface CableOutput {
  readonly mode: CableMode;

  readonly operatingCurrentA: number;

  readonly designCurrentA: number;

  readonly requiredAmpacityA: number;

  readonly selectedConductorAreaMm2: number;

  readonly selectedConductorAmpacityA: number;

  readonly conductorMaterial: string;

  readonly conductorCount: number;

  readonly cableLengthM?: number;

  readonly resistivityOhmMm2PerM?: number;

  readonly powerFactor?: number;

  readonly systemVoltageV?: number;

  readonly loadPowerW?: number;
}

export type CableResult = CalculationResult<CableOutput>;