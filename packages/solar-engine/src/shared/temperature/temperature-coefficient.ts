/**
 * PV temperature-coefficient utilities.
 *
 * Temperature coefficients are represented internally as fractional
 * change per °C.
 *
 * Examples:
 *   -0.0035 / °C = -0.35 % / °C
 *   -0.0029 / °C = -0.29 % / °C
 *   -0.0040 / °C = -0.40 % / °C
 */

export type TemperatureCoefficientType =
  | "power"
  | "voltage"
  | "current";

export interface PvTemperatureCoefficients {
  readonly powerPerC: number;
  readonly voltagePerC: number;
  readonly currentPerC: number;
}

/**
 * Converts a datasheet percentage coefficient into
 * a fractional coefficient.
 *
 * Example:
 *   -0.35 %/°C -> -0.0035 /°C
 */
export function percentageCoefficientToFraction(
  coefficientPercentPerC: number,
): number {
  return coefficientPercentPerC / 100;
}

/**
 * Converts a fractional coefficient into a datasheet-style
 * percentage coefficient.
 *
 * Example:
 *   -0.0035 /°C -> -0.35 %/°C
 */
export function fractionCoefficientToPercentage(
  coefficientPerC: number,
): number {
  return coefficientPerC * 100;
}

/**
 * Calculates the temperature delta from the reference temperature.
 */
export function calculateTemperatureDeltaC(
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): number {
  return operatingTemperatureC - referenceTemperatureC;
}

/**
 * Calculates the relative change produced by a temperature coefficient.
 *
 * Formula:
 *   relativeChange = coefficient × ΔT
 */
export function calculateTemperatureRelativeChange(
  coefficientPerC: number,
  temperatureDeltaC: number,
): number {
  return coefficientPerC * temperatureDeltaC;
}

/**
 * Applies a temperature coefficient to a reference value.
 *
 * Formula:
 *   adjusted = reference × (1 + coefficient × ΔT)
 */
export function applyTemperatureCoefficient(
  referenceValue: number,
  coefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): number {
  const temperatureDeltaC = calculateTemperatureDeltaC(
    operatingTemperatureC,
    referenceTemperatureC,
  );

  return referenceValue * (
    1 + coefficientPerC * temperatureDeltaC
  );
}

/**
 * Applies a temperature coefficient when the temperature delta
 * has already been calculated.
 */
export function applyTemperatureCoefficientFromDelta(
  referenceValue: number,
  coefficientPerC: number,
  temperatureDeltaC: number,
): number {
  return referenceValue * (
    1 + coefficientPerC * temperatureDeltaC
  );
}

/**
 * Calculates all three major PV electrical temperature effects.
 */
export function calculateTemperatureAdjustedValues(
  referencePowerW: number,
  referenceVoltageV: number,
  referenceCurrentA: number,
  coefficients: PvTemperatureCoefficients,
  operatingTemperatureC: number,
  referenceTemperatureC = 25,
): PvTemperatureCoefficients & {
  readonly powerW: number;
  readonly voltageV: number;
  readonly currentA: number;
} {
  return {
    powerPerC: coefficients.powerPerC,
    voltagePerC: coefficients.voltagePerC,
    currentPerC: coefficients.currentPerC,
    powerW: applyTemperatureCoefficient(
      referencePowerW,
      coefficients.powerPerC,
      operatingTemperatureC,
      referenceTemperatureC,
    ),
    voltageV: applyTemperatureCoefficient(
      referenceVoltageV,
      coefficients.voltagePerC,
      operatingTemperatureC,
      referenceTemperatureC,
    ),
    currentA: applyTemperatureCoefficient(
      referenceCurrentA,
      coefficients.currentPerC,
      operatingTemperatureC,
      referenceTemperatureC,
    ),
  };
}