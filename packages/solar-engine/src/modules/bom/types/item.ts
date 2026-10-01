import type { EngineeringMetadata } from "@ogwusearch/engineering-types";

export type BOMItemCategory =
  | "SOLAR_PANEL"
  | "BATTERY"
  | "INVERTER"
  | "CHARGE_CONTROLLER"
  | "DC_CABLE"
  | "AC_CABLE"
  | "DC_PROTECTION"
  | "AC_PROTECTION"
  | "DISCONNECT"
  | "FUSE"
  | "BREAKER"
  | "EARTHING"
  | "MOUNTING"
  | "CONNECTOR"
  | "TERMINAL"
  | "OTHER";

export type BOMQuantityKind =
  | "COUNT"
  | "MEASUREMENT";

export interface BOMItemSource {
  readonly module: string;
  readonly reference: string;
}

export interface BOMItem {
  readonly id: string;
  readonly category: BOMItemCategory;
  readonly description: string;
  readonly specification: string;
  readonly quantity: number;
  readonly unit: string;
  readonly quantityKind: BOMQuantityKind;
  readonly source: BOMItemSource;
  readonly metadata?: EngineeringMetadata;
}