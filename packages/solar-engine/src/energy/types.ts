/**
 * SolarAudit — Energy Engine
 *
 * Defines the typed contracts used by the energy calculation engine.
 *
 * This file contains:
 * - Input types
 * - Load types
 * - Calculation result types
 * - Warning/error contracts
 *
 * This file must not contain:
 * - Calculations
 * - Validation logic
 * - UI logic
 * - Database access
 * - API calls
 */

/* ============================================================
 * ENERGY LOAD
 * ============================================================ */

/**
 * A single electrical load used in an energy audit.
 */
export interface EnergyLoad {
  /**
   * Unique identifier for the load.
   */
  id: string;

  /**
   * Human-readable load name.
   *
   * Example: "Refrigerator"
   */
  name: string;

  /**
   * Number of identical units.
   */
  quantity: number;

  /**
   * Rated power of one unit in watts.
   */
  powerW: number;

  /**
   * Average operating hours per day.
   */
  hoursPerDay: number;
}

/* ============================================================
 * ENERGY INPUT
 * ============================================================ */

/**
 * Input supplied to the energy calculation engine.
 */
export interface EnergyInput {
  /**
   * Electrical loads included in the audit.
   */
  loads: EnergyLoad[];
}

/* ============================================================
 * LOAD ENERGY RESULT
 * ============================================================ */

/**
 * Calculated energy consumption for an individual load.
 */
export interface LoadEnergyResult {
  /**
   * Original load identifier.
   */
  loadId: string;

  /**
   * Load name.
   */
  name: string;

  /**
   * Number of units.
   */
  quantity: number;

  /**
   * Rated power of one unit in watts.
   */
  powerW: number;

  /**
   * Operating hours per day.
   */
  hoursPerDay: number;

  /**
   * Total connected power for this load in watts.
   */
  connectedPowerW: number;

  /**
   * Daily energy consumption in watt-hours.
   */
  dailyEnergyWh: number;

  /**
   * Daily energy consumption in kilowatt-hours.
   */
  dailyEnergyKWh: number;
}

/* ============================================================
 * ENERGY WARNING
 * ============================================================ */

/**
 * Non-fatal engineering warning.
 */
export interface EnergyWarning {
  /**
   * Machine-readable warning code.
   *
   * Example: "HIGH_DAILY_RUNTIME"
   */
  code: string;

  /**
   * Human-readable warning message.
   */
  message: string;

  /**
   * Optional load identifier associated with the warning.
   */
  loadId?: string;
}

/* ============================================================
 * ENERGY ERROR
 * ============================================================ */

/**
 * Structured engineering error.
 */
export interface EnergyError {
  /**
   * Machine-readable error code.
   *
   * Example: "INVALID_POWER"
   */
  code: string;

  /**
   * Human-readable error message.
   */
  message: string;

  /**
   * Optional field associated with the error.
   */
  field?: string;

  /**
   * Optional load identifier associated with the error.
   */
  loadId?: string;
}

/* ============================================================
 * ENERGY RESULT
 * ============================================================ */

/**
 * Result returned by the energy calculation engine.
 */
export interface EnergyResult {
  /**
   * Indicates whether the input passed validation
   * and the calculation completed successfully.
   */
  valid: boolean;

  /**
   * Total connected load in watts.
   */
  totalConnectedPowerW: number;

  /**
   * Total daily energy consumption in watt-hours.
   */
  totalDailyEnergyWh: number;

  /**
   * Total daily energy consumption in kilowatt-hours.
   */
  totalDailyEnergyKWh: number;

  /**
   * Individual load calculation results.
   */
  loads: LoadEnergyResult[];

  /**
   * Non-fatal engineering warnings.
   */
  warnings: EnergyWarning[];

  /**
   * Calculation/input errors.
   */
  errors: EnergyError[];
}