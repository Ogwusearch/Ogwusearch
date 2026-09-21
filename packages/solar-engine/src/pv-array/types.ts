import type { EngineeringMetadata } from "@ogwusearch/engineering-types";

/**
 * PV array sizing and configuration input.
 *
 * Represents the electrical characteristics required to determine
 * a PV array configuration.
 */
export interface PvArrayInput {
  /** PV module maximum power rating in watts. */
  modulePowerW: number;

  /** PV module voltage at maximum power point (Vmp) in volts. */
  moduleVmpV: number;

  /** PV module current at maximum power point (Imp) in amperes. */
  moduleImpA: number;

  /** PV module open-circuit voltage (Voc) in volts. */
  moduleVocV: number;

  /** PV module short-circuit current (Isc) in amperes. */
  moduleIscA: number;

  /** Number of modules connected in series per string. */
  modulesPerString: number;

  /** Number of parallel strings in the array. */
  parallelStrings: number;

  /** Optional maximum allowable array voltage in volts. */
  maxArrayVoltageV?: number;

  /** Optional maximum allowable array current in amperes. */
  maxArrayCurrentA?: number;

  /** Optional maximum allowable PV array power in watts. */
  maxArrayPowerW?: number;
}

/**
 * Calculated PV array electrical characteristics.
 */
export interface PvArrayOutput {
  /** Total number of PV modules in the array. */
  totalModules: number;

  /** Number of modules connected in series per string. */
  modulesPerString: number;

  /** Number of parallel strings. */
  parallelStrings: number;

  /** Array voltage at maximum power point in volts. */
  arrayVmpV: number;

  /** Array current at maximum power point in amperes. */
  arrayImpA: number;

  /** Array open-circuit voltage in volts. */
  arrayVocV: number;

  /** Array short-circuit current in amperes. */
  arrayIscA: number;

  /** Total PV array power in watts. */
  arrayPowerW: number;
}

/**
 * PV array calculation metadata.
 *
 * Module-specific metadata can be supplied while generic
 * engineering metadata remains owned by engineering-types.
 */
export interface PvArrayCalculationContext {
  metadata?: EngineeringMetadata;
}