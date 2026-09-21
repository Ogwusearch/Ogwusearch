export const PV_ARRAY_CONSTANTS = {
  /**
   * Minimum number of modules allowed in a series string.
   */
  minModulesPerString: 1,

  /**
   * Minimum number of parallel strings allowed.
   */
  minParallelStrings: 1,

  /**
   * Minimum valid PV module power in watts.
   */
  minModulePowerW: 0,

  /**
   * Minimum valid PV module voltage in volts.
   */
  minModuleVoltageV: 0,

  /**
   * Minimum valid PV module current in amperes.
   */
  minModuleCurrentA: 0,

  /**
   * Default engineering safety margin for array sizing.
   *
   * This value is intentionally zero here. Design margins should normally
   * be supplied explicitly by the calling calculation rather than hidden
   * inside the PV array mathematics.
   */
  defaultDesignMargin: 0,

  /**
   * Default numerical precision used when presenting calculated
   * PV-array values.
   */
  defaultPrecision: 3,
} as const;

export type PvArrayConstants = typeof PV_ARRAY_CONSTANTS;