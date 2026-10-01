/**

* Inverter Continuous Rating Calculation
*
* Calculates the required continuous inverter output power
* after applying the configured design margin.
  */

import {
INVERTER_DEFAULTS,
} from "../constants.js";

import type {
InverterInput,
} from "../types/index.js";

/**

* Calculates the required continuous inverter output power.
*
* Formula:
*
* requiredContinuousOutputPowerW =
* ```
  continuousLoadW × (1 + designMargin)
  ```
*
* When no design margin is supplied, the module default is used.
  */
  export function calculateContinuousRating(
  input: InverterInput,
  ): number {
  const designMargin =
  input.designMargin ??
  INVERTER_DEFAULTS.designMargin;

return (
input.continuousLoadW *
(1 + designMargin)
);
}
