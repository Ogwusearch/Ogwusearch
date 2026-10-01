import type {
  ElectricalMode,
  ProtectionType,
} from "./protection-input.js";

export interface ProtectionCompatibility {
  readonly currentCompatible?: boolean;
  readonly voltageCompatible?: boolean;
  readonly interruptingCompatible?: boolean;
}

export interface ProtectionOutput {
  readonly protectionType: ProtectionType;
  readonly electricalMode: ElectricalMode;

  readonly operatingCurrentA: number;
  readonly designCurrentA: number;
  readonly requiredProtectiveCurrentA: number;

  readonly selectedProtectiveCurrentA?: number;

  readonly requiredVoltageRatingV: number;
  readonly selectedDeviceVoltageRatingV?: number;

  readonly interruptingRatingRequirementA?: number;
  readonly selectedDeviceInterruptingRatingA?: number;

  readonly compatibility: ProtectionCompatibility;
}

export type ProtectionResultOutput = ProtectionOutput;