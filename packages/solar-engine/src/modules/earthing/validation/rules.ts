import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  EarthingInput,
} from "../types/index.js";

function issue(
  code: string,
  message: string,
  path: string,
  actual: unknown,
): EngineeringIssue {
  return {
    code,
    message,
    severity: "ERROR",
    path,
    metadata: {
      extras: {
        actual,
      },
    },
  };
}

export function validateEarthingRules(
  input: EarthingInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  const {
    electrical,
    design,
  } = input;

  if (
    !Number.isFinite(
      electrical.faultCurrentA,
    ) ||
    electrical.faultCurrentA <= 0
  ) {
    issues.push(
      issue(
        "INVALID_FAULT_CURRENT",
        "Fault current must be a finite value greater than zero.",
        "electrical.faultCurrentA",
        electrical.faultCurrentA,
      ),
    );
  }

  if (
    !Number.isFinite(
      electrical.faultClearingTimeS,
    ) ||
    electrical.faultClearingTimeS <= 0
  ) {
    issues.push(
      issue(
        "INVALID_FAULT_CLEARING_TIME",
        "Fault-clearing time must be a finite value greater than zero.",
        "electrical.faultClearingTimeS",
        electrical.faultClearingTimeS,
      ),
    );
  }

  if (
    !Number.isFinite(
      electrical.conductorConstantA_SqrtS_PerMm2,
    ) ||
    electrical.conductorConstantA_SqrtS_PerMm2 <= 0
  ) {
    issues.push(
      issue(
        "INVALID_CONDUCTOR_CONSTANT",
        "Conductor constant must be a finite value greater than zero.",
        "electrical.conductorConstantA_SqrtS_PerMm2",
        electrical.conductorConstantA_SqrtS_PerMm2,
      ),
    );
  }

  if (
    electrical.resistivityOhmM !== undefined &&
    (!Number.isFinite(
      electrical.resistivityOhmM,
    ) ||
      electrical.resistivityOhmM <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_SOIL_RESISTIVITY",
        "Soil resistivity must be a finite value greater than zero.",
        "electrical.resistivityOhmM",
        electrical.resistivityOhmM,
      ),
    );
  }

  if (
    electrical.electrodeLengthM !== undefined &&
    (!Number.isFinite(
      electrical.electrodeLengthM,
    ) ||
      electrical.electrodeLengthM <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_ELECTRODE_LENGTH",
        "Electrode length must be a finite value greater than zero.",
        "electrical.electrodeLengthM",
        electrical.electrodeLengthM,
      ),
    );
  }

  if (
    electrical.electrodeDiameterM !== undefined &&
    (!Number.isFinite(
      electrical.electrodeDiameterM,
    ) ||
      electrical.electrodeDiameterM <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_ELECTRODE_DIAMETER",
        "Electrode diameter must be a finite value greater than zero.",
        "electrical.electrodeDiameterM",
        electrical.electrodeDiameterM,
      ),
    );
  }

  if (
    design?.designMargin !== undefined &&
    (!Number.isFinite(
      design.designMargin,
    ) ||
      design.designMargin < 0 ||
      design.designMargin > 1)
  ) {
    issues.push(
      issue(
        "INVALID_DESIGN_MARGIN",
        "Design margin must be a finite ratio between 0 and 1.",
        "design.designMargin",
        design.designMargin,
      ),
    );
  }

  if (
    design?.bondingConductorFactor !==
      undefined &&
    (!Number.isFinite(
      design.bondingConductorFactor,
    ) ||
      design.bondingConductorFactor <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_BONDING_FACTOR",
        "Bonding-conductor factor must be a finite value greater than zero.",
        "design.bondingConductorFactor",
        design.bondingConductorFactor,
      ),
    );
  }

  if (
    design?.earthResistanceTargetOhm !==
      undefined &&
    (!Number.isFinite(
      design.earthResistanceTargetOhm,
    ) ||
      design.earthResistanceTargetOhm <= 0)
  ) {
    issues.push(
      issue(
        "INVALID_EARTH_RESISTANCE_TARGET",
        "Earth-resistance target must be a finite value greater than zero.",
        "design.earthResistanceTargetOhm",
        design.earthResistanceTargetOhm,
      ),
    );
  }

  return issues;
}