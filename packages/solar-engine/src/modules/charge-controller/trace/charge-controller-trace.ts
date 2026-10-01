import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "../types/index.js";

/**
 * Domain-level trace step for charge-controller sizing.
 *
 * The engineering-core adapter converts these domain steps into
 * CalculationTraceStep objects.
 */
export interface ChargeControllerTraceStep {
  readonly name: string;
  readonly description: string;
  readonly input?: unknown;
  readonly output?: unknown;
}

/**
 * Creates the auditable domain trace for a charge-controller
 * sizing calculation.
 *
 * This function only records inputs, outputs, and calculation
 * stages. It does not perform engineering calculations.
 */
export function createChargeControllerTrace(
  input: ChargeControllerSizingInput,
  value: ChargeControllerSizingValue,
): ChargeControllerTraceStep[] {
  return [
    {
      name: "current-requirements",
      description:
        "Calculate PV charging current, controller output current, required controller current, and required controller power.",
      input: {
        pvArrayPowerW:
          input.pvArrayPowerW,

        batteryVoltageV:
          input.batteryVoltageV,

        controllerEfficiency:
          input.controllerEfficiency,

        safetyMargin:
          input.safetyMargin,
      },
      output: {
        pvChargingCurrentA:
          value.pvChargingCurrentA,

        controllerOutputCurrentA:
          value.controllerOutputCurrentA,

        requiredControllerCurrentA:
          value.requiredControllerCurrentA,

        requiredControllerPowerW:
          value.requiredControllerPowerW,
      },
    },

    {
      name: "current-compatibility",
      description:
        "Evaluate the supplied controller current rating against the required controller current.",
      input: {
        controllerRatedCurrentA:
          input.controllerRatedCurrentA,
      },
      output: {
        controllerCurrentMarginA:
          value.controllerCurrentMarginA,

        currentCompatible:
          value.currentCompatible,
      },
    },

    {
      name: "voltage-compatibility",
      description:
        "Evaluate PV open-circuit voltage against the controller maximum PV input voltage.",
      input: {
        pvArrayVocV:
          input.pvArrayVocV,

        controllerMaxPVVoltageV:
          input.controllerMaxPVVoltageV,
      },
      output: {
        voltageCompatible:
          value.voltageCompatible,
      },
    },

    {
      name: "mppt-compatibility",
      description:
        "Evaluate PV operating voltage against the controller MPPT voltage range.",
      input: {
        pvArrayVmpV:
          input.pvArrayVmpV,

        controllerMPPTMinVoltageV:
          input.controllerMPPTMinVoltageV,

        controllerMPPTMaxVoltageV:
          input.controllerMPPTMaxVoltageV,
      },
      output: {
        mpptCompatible:
          value.mpptCompatible,
      },
    },

    {
      name: "pv-current-compatibility",
      description:
        "Evaluate PV input current against the controller maximum PV input current, using Isc when supplied and otherwise Imp.",
      input: {
        pvArrayImpA:
          input.pvArrayImpA,

        pvArrayIscA:
          input.pvArrayIscA,

        controllerMaxPVCurrentA:
          input.controllerMaxPVCurrentA,
      },
      output: {
        pvCurrentMarginA:
          value.pvCurrentMarginA,

        pvCurrentCompatible:
          value.pvCurrentCompatible,
      },
    },

    {
      name: "system-compatibility",
      description:
        "Evaluate overall charge-controller compatibility using all supplied compatibility checks.",
      output: {
        currentCompatible:
          value.currentCompatible,

        voltageCompatible:
          value.voltageCompatible,

        mpptCompatible:
          value.mpptCompatible,

        pvCurrentCompatible:
          value.pvCurrentCompatible,

        systemCompatible:
          value.systemCompatible,
      },
    },
  ];
}