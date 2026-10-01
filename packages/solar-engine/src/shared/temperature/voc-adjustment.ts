import {
  applyTemperatureCoefficient,
  calculateTemperatureDeltaC,
} from "./temperature-coefficient.js";

/**
 * Calculates temperature-adjusted PV open-circuit voltage (Voc).
 *
 * Formula:
 *
 *   Voc(T) = Voc_ref × [1 + βVoc × (T - Tref)]
 *
 * Where:
 * - Voc_ref = reference open-circuit voltage
 * - βVoc = Voc temperature coefficient as a fraction per °C
 * - T = operating cell temperature
 * - Tref = reference temperature
 *
 * Voc temperature coefficients are normally negative.
 */
export function calculateVocAtTemperature(
  referenceVocV: number,
  vocTemperatureCoefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): number {
  return applyTemperatureCoefficient(
    referenceVocV,
    vocTemperatureCoefficientPerC,
    operatingTemperatureC,
    referenceTemperatureC,
  );
}

/**
 * Calculates the absolute Voc adjustment caused by temperature.
 *
 * Formula:
 *
 *   ΔVoc = Voc_ref × βVoc × ΔT
 */
export function calculateVocAdjustmentV(
  referenceVocV: number,
  vocTemperatureCoefficientPerC: number,
  temperatureDeltaC: number,
): number {
  return (
    referenceVocV *
    vocTemperatureCoefficientPerC *
    temperatureDeltaC
  );
}

/**
 * Calculates the relative Voc adjustment as a decimal fraction.
 *
 * Formula:
 *
 *   ΔVoc / Voc_ref = βVoc × ΔT
 */
export function calculateVocAdjustmentFraction(
  vocTemperatureCoefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): number {
  const temperatureDeltaC = calculateTemperatureDeltaC(
    operatingTemperatureC,
    referenceTemperatureC,
  );

  return (
    vocTemperatureCoefficientPerC *
    temperatureDeltaC
  );
}

/**
 * Calculates the Voc adjustment as a percentage.
 *
 * Example:
 *   -0.0029 / °C at 45 °C relative to 25 °C
 *   = -5.8%
 */
export function calculateVocAdjustmentPercent(
  vocTemperatureCoefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): number {
  return (
    calculateVocAdjustmentFraction(
      vocTemperatureCoefficientPerC,
      operatingTemperatureC,
      referenceTemperatureC,
    ) * 100
  );
}

/**
 * Converts a datasheet Voc temperature coefficient expressed
 * in %/°C into a fractional coefficient.
 *
 * Example:
 *   -0.29 %/°C → -0.0029 /°C
 */
export function convertVocCoefficientPercentToFraction(
  vocTemperatureCoefficientPercentPerC: number,
): number {
  return vocTemperatureCoefficientPercentPerC / 100;
}

/**
 * Converts a fractional Voc temperature coefficient into
 * datasheet-style %/°C notation.
 *
 * Example:
 *   -0.0029 /°C → -0.29 %/°C
 */
export function convertVocCoefficientFractionToPercent(
  vocTemperatureCoefficientPerC: number,
): number {
  return vocTemperatureCoefficientPerC * 100;
}