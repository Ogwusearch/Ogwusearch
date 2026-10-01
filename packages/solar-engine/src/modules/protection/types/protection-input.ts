export type ProtectionType =
  | "AC_BREAKER"
  | "DC_FUSE"
  | "OVERCURRENT_DEVICE"
  | "STRING_FUSE";

export type ElectricalMode = "AC" | "DC";

export interface ProtectionSelectionInput {
  readonly currentRatingA?: number;
  readonly voltageRatingV?: number;
  readonly interruptingRatingA?: number;
  readonly availableCurrentRatingsA?: readonly number[];
}

export interface ProtectionElectricalInput {
  readonly operatingCurrentA: number;
  readonly systemVoltageV: number;
  readonly designCurrentA?: number;
  readonly shortCircuitCurrentA?: number;
}

export interface ProtectionDesignInput {
  readonly designMargin?: number;
  readonly explicitProtectionFactor?: number;
}

export interface ProtectionInput {
  readonly protection: {
    readonly type: ProtectionType;
    readonly mode: ElectricalMode;
  };

  readonly electrical: ProtectionElectricalInput;

  readonly design?: ProtectionDesignInput;

  readonly device?: ProtectionSelectionInput;
}