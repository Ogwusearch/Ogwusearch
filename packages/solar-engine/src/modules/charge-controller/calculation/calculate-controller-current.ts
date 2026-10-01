
import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "../types/index.js";

export function calculateCurrentRequirements(
  input: ChargeControllerSizingInput,
): Pick<
  ChargeControllerSizingValue,
  | "pvChargingCurrentA"
  | "controllerOutputCurrentA"
  | "requiredControllerCurrentA"
  | "requiredControllerPowerW"
> {
  const pvChargingCurrentA =
    input.pvArrayPowerW / input.batteryVoltageV;

  const controllerOutputCurrentA =
    (input.pvArrayPowerW * input.controllerEfficiency) /
    input.batteryVoltageV;

  const requiredControllerCurrentA =
    controllerOutputCurrentA * (1 + input.safetyMargin);

  const requiredControllerPowerW =
    controllerOutputCurrentA *
    input.batteryVoltageV *
    (1 + input.safetyMargin);

  return {
    pvChargingCurrentA,
    controllerOutputCurrentA,
    requiredControllerCurrentA,
    requiredControllerPowerW,
  };
}

export function calculateCurrentCompatibility(
  input: ChargeControllerSizingInput,
  requiredControllerCurrentA: number,
): Pick<
  ChargeControllerSizingValue,
  | "controllerRatedCurrentA"
  | "controllerCurrentMarginA"
  | "currentCompatible"
> {
  const ratedCurrentA = input.controllerRatedCurrentA;

  if (ratedCurrentA === undefined) {
    return {};
  }

  const controllerCurrentMarginA =
    ratedCurrentA - requiredControllerCurrentA;

  return {
    controllerRatedCurrentA: ratedCurrentA,
    controllerCurrentMarginA,
    currentCompatible: controllerCurrentMarginA >= 0,
  };
}
