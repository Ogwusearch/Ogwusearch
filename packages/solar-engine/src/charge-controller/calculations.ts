// Charge controller calculations
// /home/ogwu/workspace/ogwusearch/packages/solar-engine/src/charge-controller/calculations.ts

import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "./types";

export function calculateChargeControllerSizing(
  input: ChargeControllerSizingInput
): ChargeControllerSizingValue {
  const {
    pvArrayPowerW,
    batteryVoltageV,
    controllerEfficiency,
    safetyMargin,

    pvArrayVmpV,
    pvArrayVocV,
    pvArrayImpA,
    pvArrayIscA,

    controllerRatedCurrentA,
    controllerMaxPVVoltageV,
    controllerMPPTMinVoltageV,
    controllerMPPTMaxVoltageV,
    controllerMaxPVCurrentA,
  } = input;

  /*
   * PV charging current based on nominal battery/system voltage.
   *
   * This represents the theoretical charging current available
   * from the PV array before controller efficiency losses.
   */
  const pvChargingCurrentA =
    pvArrayPowerW / batteryVoltageV;

  /*
   * Estimated battery-side controller output current after
   * accounting for controller losses.
   */
  const controllerOutputCurrentA =
    (pvArrayPowerW * controllerEfficiency) /
    batteryVoltageV;

  /*
   * Apply the engineering safety margin to the actual
   * controller output current requirement.
   */
  const requiredControllerCurrentA =
    controllerOutputCurrentA *
    (1 + safetyMargin);

  const result: ChargeControllerSizingValue = {
    pvChargingCurrentA,
    controllerOutputCurrentA,
    requiredControllerCurrentA,
  };

  /*
   * Optional controller continuous-current compatibility.
   */
  if (controllerRatedCurrentA !== undefined) {
    const controllerCurrentMarginA =
      controllerRatedCurrentA -
      requiredControllerCurrentA;

    const currentCompatible =
      controllerCurrentMarginA >= 0;

    result.controllerRatedCurrentA =
      controllerRatedCurrentA;

    result.controllerCurrentMarginA =
      controllerCurrentMarginA;

    result.currentCompatible =
      currentCompatible;
  }

  /*
   * Optional PV open-circuit voltage compatibility.
   *
   * Voc must not exceed the maximum PV input voltage
   * accepted by the controller.
   */
  if (
    pvArrayVocV !== undefined &&
    controllerMaxPVVoltageV !== undefined
  ) {
    result.voltageCompatible =
      pvArrayVocV <= controllerMaxPVVoltageV;
  }

  /*
   * Optional MPPT operating-voltage compatibility.
   *
   * The PV operating voltage must fall inside the
   * controller's MPPT voltage window.
   */
  if (
    pvArrayVmpV !== undefined &&
    controllerMPPTMinVoltageV !== undefined &&
    controllerMPPTMaxVoltageV !== undefined
  ) {
    result.mpptCompatible =
      pvArrayVmpV >=
        controllerMPPTMinVoltageV &&
      pvArrayVmpV <=
        controllerMPPTMaxVoltageV;
  }

  /*
   * Optional PV input-current compatibility.
   *
   * Use Isc where available because the controller's
   * maximum PV input current is a protective input limit.
   */
  const pvCurrentForValidation =
    pvArrayIscA ?? pvArrayImpA;

  if (
    pvCurrentForValidation !== undefined &&
    controllerMaxPVCurrentA !== undefined
  ) {
    result.pvCurrentCompatible =
      pvCurrentForValidation <=
      controllerMaxPVCurrentA;

    result.pvCurrentMarginA =
      controllerMaxPVCurrentA -
      pvCurrentForValidation;
  }

  /*
   * Optional calculated controller power requirement.
   *
   * This represents the battery-side power delivered
   * by the controller with the safety margin applied.
   */
  const requiredControllerPowerW =
    controllerOutputCurrentA *
    batteryVoltageV *
    (1 + safetyMargin);

  result.requiredControllerPowerW =
    requiredControllerPowerW;

  /*
   * Determine overall compatibility from whichever
   * compatibility checks were actually supplied.
   */
  const compatibilityChecks: boolean[] = [];

  if (
    result.currentCompatible !== undefined
  ) {
    compatibilityChecks.push(
      result.currentCompatible
    );
  }

  if (
    result.voltageCompatible !== undefined
  ) {
    compatibilityChecks.push(
      result.voltageCompatible
    );
  }

  if (
    result.mpptCompatible !== undefined
  ) {
    compatibilityChecks.push(
      result.mpptCompatible
    );
  }

  if (
    result.pvCurrentCompatible !== undefined
  ) {
    compatibilityChecks.push(
      result.pvCurrentCompatible
    );
  }

  if (compatibilityChecks.length > 0) {
    result.systemCompatible =
      compatibilityChecks.every(Boolean);
  }

  /*
   * Preserve supplied PV operating values in the
   * engineering result for traceability.
   */
  if (pvArrayImpA !== undefined) {
    result.pvArrayImpA = pvArrayImpA;
  }

  if (pvArrayIscA !== undefined) {
    result.pvArrayIscA = pvArrayIscA;
  }

  return result;
}