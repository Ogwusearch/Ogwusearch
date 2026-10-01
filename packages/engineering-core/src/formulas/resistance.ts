/**
 * Generic conductor-resistance relationships.
 *
 * Units:
 * - Length: metres (m)
 * - Area: square millimetres (mm²)
 * - Resistivity: ohm-metres (Ω·m)
 * - Resistance: ohms (Ω)
 */

const COPPER_RESISTIVITY_OHM_M = 1.724e-8;
const ALUMINIUM_RESISTIVITY_OHM_M = 2.826e-8;

export type ConductorMaterial =
  | "copper"
  | "aluminium";

/**
 * Returns conductor resistivity in Ω·m.
 */
export function getConductorResistivity(
  material: ConductorMaterial = "copper",
): number {
  return material === "copper"
    ? COPPER_RESISTIVITY_OHM_M
    : ALUMINIUM_RESISTIVITY_OHM_M;
}

/**
 * R = ρ × L / A
 */
export function calculateConductorResistance(
  lengthM: number,
  areaMm2: number,
  material: ConductorMaterial = "copper",
): number {
  const resistivity =
    getConductorResistivity(material);

  const areaM2 =
    areaMm2 * 1e-6;

  return (
    resistivity * lengthM
  ) / areaM2;
}

/**
 * Calculates resistance of a two-conductor loop.
 */
export function calculateLoopResistance(
  oneWayLengthM: number,
  areaMm2: number,
  material: ConductorMaterial = "copper",
): number {
  return calculateConductorResistance(
    oneWayLengthM * 2,
    areaMm2,
    material,
  );
}

/**
 * Calculates resistance of two conductors
 * with independently supplied lengths.
 */
export function calculateTwoConductorResistance(
  forwardLengthM: number,
  returnLengthM: number,
  areaMm2: number,
  material: ConductorMaterial = "copper",
): number {
  return calculateConductorResistance(
    forwardLengthM + returnLengthM,
    areaMm2,
    material,
  );
}

/**
 * R_T = R_ref × [1 + α × (T - T_ref)]
 */
export function calculateTemperatureAdjustedResistance(
  referenceResistanceOhms: number,
  temperatureCoefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 20,
): number {
  return (
    referenceResistanceOhms *
    (
      1 +
      temperatureCoefficientPerC *
      (
        operatingTemperatureC -
        referenceTemperatureC
      )
    )
  );
}

/**
 * Calculates resistance from geometry and
 * temperature-adjusted material behavior.
 */
export function calculateResistanceAtTemperature(
  lengthM: number,
  areaMm2: number,
  material: ConductorMaterial,
  temperatureCoefficientPerC: number,
  operatingTemperatureC: number,
  referenceTemperatureC = 20,
): number {
  const referenceResistance =
    calculateConductorResistance(
      lengthM,
      areaMm2,
      material,
    );

  return calculateTemperatureAdjustedResistance(
    referenceResistance,
    temperatureCoefficientPerC,
    operatingTemperatureC,
    referenceTemperatureC,
  );
}
