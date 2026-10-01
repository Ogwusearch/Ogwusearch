
import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

import type {
  ChargeControllerSizingInput,
} from "../types/index.js";

export function createChargeControllerAssumptions(
  input: ChargeControllerSizingInput,
): EngineeringAssumption[] {
  return [
    {
      code: "PV_CHARGING_CURRENT_ESTIMATE",
      name: "PV charging current estimation",
      value:
        "PV charging current is estimated from PV array power divided by battery voltage.",
    },
    {
      code: "CONTROLLER_EFFICIENCY_APPLIED",
      name: "Controller efficiency",
      value:
        input.controllerEfficiency,
    },
    {
      code: "SAFETY_MARGIN_APPLIED",
      name: "Charge controller safety margin",
      value:
        input.safetyMargin,
    },
  ];
}
