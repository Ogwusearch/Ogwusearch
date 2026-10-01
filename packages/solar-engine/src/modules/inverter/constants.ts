/**

* Inverter Sizing Constants
*
* Module-level engineering defaults and thresholds used by
* the Solar Engine Inverter Sizing module.
*
* Constants are kept separate from calculations so that
* engineering assumptions remain explicit, auditable, and
* easy to revise without changing calculation logic.
  */

export const INVERTER_DEFAULTS = {
/**

* Default design margin applied when the input does not
* explicitly provide one.
*
* 0.20 = 20%
  */
  designMargin: 0.20,
  } as const;

/**

* Engineering thresholds used to classify potentially
* undesirable inverter operating conditions.
  */
  export const INVERTER_THRESHOLDS = {
  /**

  * Efficiency below this ratio may generate a warning.
  *
  * 0.90 = 90%
    */
    lowEfficiency: 0.90,

/**

* Power factor below this ratio may generate a warning.
*
* 0.80 = 80%
  */
  lowPowerFactor: 0.80,

/**

* Continuous capacity margin below this ratio may generate
* a low-margin warning.
  */
  lowContinuousMargin: 0.10,

/**

* Surge capacity margin below this ratio may generate
* a low-margin warning.
  */
  lowSurgeMargin: 0.10,
  } as const;

/**

* Metadata describing the inverter sizing calculation
* within the Solar Engine.
  */
  export const INVERTER_METADATA = {
  module: "@ogwusearch/solar-engine",
  version: "0.1.0",
  name: "Inverter Sizing",
  domain: "inverter-sizing",
  unitSystem: "SI",
  } as const;
