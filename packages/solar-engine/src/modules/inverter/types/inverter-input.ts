/**

* Inverter Sizing Input
*
* Defines the immutable input contract for the
* Solar Engine Inverter Sizing module.
  */
  export interface InverterInput {
  /**

  * Projected continuous AC load in watts.
    */
    readonly continuousLoadW: number;

/**

* Projected peak/surge AC load in watts.
  */
  readonly surgeLoadW: number;

/**

* DC system voltage used for inverter input calculations.
  */
  readonly systemVoltageV: number;

/**

* Inverter conversion efficiency as a ratio.
*
* Example:
* 0.92 = 92%
  */
  readonly inverterEfficiency: number;

/**

* Optional AC power factor.
*
* Used to calculate apparent power when supplied.
  */
  readonly powerFactor?: number;

/**

* Explicit inverter sizing/design margin as a ratio.
*
* Example:
* 0.20 = 20%
*
* When omitted, the module default is applied.
  */
  readonly designMargin?: number;

/**

* Optional continuous inverter output rating in watts.
  */
  readonly inverterRatedPowerW?: number;

/**

* Optional inverter surge output rating in watts.
  */
  readonly inverterSurgePowerW?: number;

/**

* Optional minimum supported DC input voltage.
  */
  readonly inverterInputVoltageMinV?: number;

/**

* Optional maximum supported DC input voltage.
  */
  readonly inverterInputVoltageMaxV?: number;

/**

* Optional required AC output voltage.
  */
  readonly requiredOutputVoltageV?: number;

/**

* Optional inverter AC output voltage.
  */
  readonly inverterOutputVoltageV?: number;
  }
