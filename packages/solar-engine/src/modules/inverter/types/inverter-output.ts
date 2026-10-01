/**

* Inverter Sizing Output
*
* Defines the immutable engineering values produced by
* the Solar Engine Inverter Sizing module.
  */
  export interface InverterOutput {
  /**

  * Required continuous inverter output power in watts.
    */
    readonly requiredContinuousOutputPowerW: number;

/**

* Required surge inverter output power in watts.
  */
  readonly requiredSurgeOutputPowerW: number;

/**

* Required continuous apparent power in volt-amperes.
*
* Omitted when power factor is not supplied.
  */
  readonly requiredContinuousVA?: number;

/**

* Required continuous DC input power in watts.
  */
  readonly requiredContinuousInputPowerW: number;

/**

* Required surge DC input power in watts.
  */
  readonly requiredSurgeInputPowerW: number;

/**

* Required continuous DC input current in amperes.
  */
  readonly requiredContinuousDCInputCurrentA: number;

/**

* Required surge DC input current in amperes.
  */
  readonly requiredSurgeDCInputCurrentA: number;

/**

* Supplied continuous inverter rating in watts.
  */
  readonly inverterRatedPowerW?: number;

/**

* Difference between supplied continuous rating and
* required continuous output power.
  */
  readonly continuousMarginW?: number;

/**

* Whether the supplied continuous inverter rating
* satisfies the calculated requirement.
  */
  readonly continuousCompatible?: boolean;

/**

* Supplied inverter surge rating in watts.
  */
  readonly inverterSurgePowerW?: number;

/**

* Difference between supplied surge rating and
* required surge output power.
  */
  readonly surgeMarginW?: number;

/**

* Whether the supplied inverter surge rating
* satisfies the calculated requirement.
  */
  readonly surgeCompatible?: boolean;

/**

* Whether the system DC voltage is within the supplied
* inverter input voltage range.
  */
  readonly inputVoltageCompatible?: boolean;

/**

* Whether the required AC output voltage matches the
* supplied inverter output voltage.
  */
  readonly outputVoltageCompatible?: boolean;

/**

* Overall compatibility derived from all available
* compatibility checks.
*
* Undefined when no compatibility checks are available.
  */
  readonly systemCompatible?: boolean;
  }
