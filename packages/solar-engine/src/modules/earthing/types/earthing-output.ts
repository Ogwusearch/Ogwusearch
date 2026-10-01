export interface EarthingCompatibility {
  readonly earthResistanceCompatible?: boolean;
}

export interface EarthingOutput {
  readonly mode: "AC" | "DC";

  readonly faultCurrentA: number;

  readonly faultClearingTimeS: number;

  readonly requiredEarthConductorAreaMm2: number;

  readonly selectedEarthConductorAreaMm2: number;

  readonly requiredBondingConductorAreaMm2: number;

  readonly selectedBondingConductorAreaMm2: number;

  readonly earthResistanceOhm?: number;

  readonly earthResistanceTargetOhm?: number;

  readonly compatibility: EarthingCompatibility;
}

export type EarthingResultOutput = EarthingOutput;