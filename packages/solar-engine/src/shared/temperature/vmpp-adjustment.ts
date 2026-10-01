import {
  applyTemperatureCoefficient,
  calculateTemperatureDeltaC,
} from "./temperature-coefficient.js";

/**
 * PV maximum-power voltage (Vmpp) temperature adjustment.
 *
 * Temperature coefficients are represented as fractional change
 * per degree Celsius.
 *
 * Example:
 *   -0.003 / °C = -0.30 % / °C
 *
 * The reference temperature is normally the module datasheet
 * reference temperature, commonly 25 °C.
 */

/**
 * Calculates temperature-adjusted Vmpp.
 *
 * Formula:
 *
 *   Vmpp(T) =
 *     Vmpp_ref × [1 + βVmpp × (T - Tref)]
 *
 * Where:
 * - Vmpp_ref = reference maximum-power voltage
 * - βVmpp = Vmpp temperature coefficient per °C
 * - T = operating cell temperature
 * - Tref = reference temperature
 */
export function calculateVmppAtTemperature(
  referenceVmppV: number,
  vmppTemperatureCoefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): number {
  return applyTemperatureCoefficient(
    referenceVmppV,
    vmppTemperatureCoefficientPerC,
    operatingTemperatureC,
    referenceTemperatureC,
  );
}

/**
 * Calculates the absolute Vmpp adjustment.
 *
 * Formula:
 *
 *   ΔVmpp =
 *     Vmpp_ref × βVmpp × ΔT
 *
 * The returned value is the change from the reference Vmpp.
 * It may be positive or negative.
 */
export function calculateVmppAdjustmentV(
  referenceVmppV: number,
  vmppTemperatureCoefficientPerC: number,
  temperatureDeltaC: number,
): number {
  return (
    referenceVmppV *
    vmppTemperatureCoefficientPerC *
    temperatureDeltaC
  );
}

/**
 * Calculates the fractional Vmpp change caused by temperature.
 *
 * Formula:
 *
 *   ΔVmpp / Vmpp_ref = βVmpp × ΔT
 */
export function calculateVmppAdjustmentFraction(
  vmppTemperatureCoefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): number {
  const temperatureDeltaC = calculateTemperatureDeltaC(
    operatingTemperatureC,
    referenceTemperatureC,
  );

  return (
    vmppTemperatureCoefficientPerC *
    temperatureDeltaC
  );
}

/**
 * Calculates the percentage Vmpp change caused by temperature.
 *
 * Example:
 *   -0.003 × 25 °C = -0.075
 *   = -7.5%
 */
export function calculateVmppAdjustmentPercent(
  vmppTemperatureCoefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): number {
  return (
    calculateVmppAdjustmentFraction(
      vmppTemperatureCoefficientPerC,
      operatingTemperatureC,
      referenceTemperatureC,
    ) * 100
  );
}