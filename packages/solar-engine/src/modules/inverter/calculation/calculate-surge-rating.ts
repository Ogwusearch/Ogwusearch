/**

* Inverter Surge Rating Calculation
*
* Calculates the required inverter surge output power
* after applying the configured design margin.
  */

import {
INVERTER_DEFAULTS,
} from "../constants.js";

import type {
InverterInput,
} from "../types/index.js";

/**

* Calculates the required surge inverter output power.
*
* Formula:
*
* requiredSurgeOutputPowerW =
* ```
  surgeLoadW × (1 + designMargin)
  ```
*
* When no design margin is supplied, the module default is used.
  */
  export function calculateSurgeRating(
  input: InverterInput,
  ): number {
  const designMargin =
  input.designMargin ??
  INVERTER_DEFAULTS.designMargin;

return (
input.surgeLoadW *
(1 + designMargin)
);
}
