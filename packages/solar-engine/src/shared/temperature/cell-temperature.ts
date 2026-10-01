/**
 * PV cell-temperature calculations.
 *
 * These functions are pure mathematical helpers.
 * Validation belongs to the appropriate domain-validation layer.
 *
 * Units:
 * - Temperature: °C
 * - Irradiance: W/m²
 */

import {
  PV_REFERENCE_AMBIENT_TEMPERATURE,
} from "../constants/pv.js";

/**
 * Calculates PV cell temperature using a NOCT-style relationship.
 *
 * Formula:
 *   Tcell = Tambient + ((NOCT - 20) / 800) × G
 *
 * Where:
 * - Tcell = cell temperature (°C)
 * - Tambient = ambient temperature (°C)
 * - NOCT = nominal operating cell temperature (°C)
 * - G = irradiance (W/m²)
 */
export function calculateCellTemperatureC(
  ambientTemperatureC: number,
  irradianceWPerM2: number,
  noctC = 45,
): number {
  return (
    ambientTemperatureC +
    ((noctC - 20) / 800) *
      irradianceWPerM2
  );
}

/**
 * Calculates cell temperature from ambient temperature
 * and an explicit temperature rise.
 *
 * Formula:
 *   Tcell = Tambient + ΔT
 */
export function calculateCellTemperatureFromRiseC(
  ambientTemperatureC: number,
  temperatureRiseC: number,
): number {
  return ambientTemperatureC + temperatureRiseC;
}

/**
 * Calculates the temperature rise between cell and ambient
 * temperatures.
 *
 * Formula:
 *   ΔT = Tcell - Tambient
 */
export function calculateCellTemperatureRiseC(
  cellTemperatureC: number,
  ambientTemperatureC: number,
): number {
  return cellTemperatureC - ambientTemperatureC;
}

/**
 * Calculates the cell-temperature rise using a NOCT-style model.
 *
 * Formula:
 *   ΔT = ((NOCT - 20) / 800) × G
 */
export function calculateNoctTemperatureRiseC(
  irradianceWPerM2: number,
  noctC = 45,
): number {
  return (
    ((noctC - 20) / 800) *
    irradianceWPerM2
  );
}

/**
 * Calculates cell temperature using the default reference
 * ambient temperature when no ambient value is supplied.
 */
export function calculateCellTemperatureAtReferenceAmbientC(
  irradianceWPerM2: number,
  noctC = 45,
): number {
  return calculateCellTemperatureC(
    PV_REFERENCE_AMBIENT_TEMPERATURE,
    irradianceWPerM2,
    noctC,
  );
}

/**
 * Converts Celsius to Kelvin.
 */
export function celsiusToKelvin(
  temperatureC: number,
): number {
  return temperatureC + 273.15;
}

/**
 * Converts Kelvin to Celsius.
 */
export function kelvinToCelsius(
  temperatureK: number,
): number {
  return temperatureK - 273.15;
}