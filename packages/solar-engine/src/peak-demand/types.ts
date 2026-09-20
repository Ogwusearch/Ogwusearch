/**
 * Peak Demand Engine
 *
 * Engineering input/output types.
 */

/**
 * Individual electrical load.
 */
export interface PeakDemandLoad {
  name: string;
  quantity: number;
  powerW: number;
  demandFactor?: number;
}

/**
 * Peak demand calculation input.
 */
export interface PeakDemandInput {
  loads: PeakDemandLoad[];
}

/**
 * Calculated result for an individual load.
 */
export interface PeakDemandLoadResult {
  name: string;
  quantity: number;
  powerW: number;
  demandFactor: number;
  connectedLoadW: number;
  demandLoadW: number;
}

/**
 * Complete peak demand calculation value.
 */
export interface PeakDemandValue {
  connectedLoadW: number;
  connectedLoadKW: number;
  peakDemandW: number;
  peakDemandKW: number;
  loads: PeakDemandLoadResult[];
}

/**
 * Standard engineering message.
 */
export interface EngineeringMessage {
  code: string;
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Validation result.
 */
export interface ValidationResult {
  valid: boolean;
  errors: EngineeringMessage[];
  warnings: EngineeringMessage[];
}

/**
 * Calculation formulas used by the engine.
 */
export interface PeakDemandCalculationFormulas {
  connectedLoadW: string;
  demandLoadW: string;
  connectedLoadKW: string;
  peakDemandKW: string;
}

/**
 * Individual calculation trace.
 */
export interface PeakDemandCalculation {
  load: string;
  quantity: number;
  powerW: number;
  demandFactor: number;
  connectedLoadW: number;
  demandLoadW: number;
}

/**
 * Complete calculation trace.
 *
 * Provides engineering transparency and
 * records assumptions used by the engine.
 */
export interface PeakDemandCalculationTrace {
  formulas: PeakDemandCalculationFormulas;
  assumptions: string[];
  calculations: PeakDemandCalculation[];
}

/**
 * Engine metadata.
 */
export interface PeakDemandMetadata {
  engine: "peak-demand";
  version: string;
  unitSystem: "SI";
}

/**
 * Peak demand engineering result.
 */
export interface PeakDemandResult {
  success: boolean;
  value?: PeakDemandValue;
  errors: EngineeringMessage[];
  warnings: EngineeringMessage[];
  trace?: PeakDemandCalculationTrace;
  metadata: PeakDemandMetadata;
}