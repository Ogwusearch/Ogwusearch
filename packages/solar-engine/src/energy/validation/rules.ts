import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  EnergyInput,
  EnergyLoadInput,
} from "../types/energy-input.js";

import {
  ENERGY_DEFAULTS,
} from "../constants.js";

function validateEnergyLoad(
  load: EnergyLoadInput,
  index: number,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];
  const path = `loads[${index}]`;

  if (!load.loadId.trim()) {
    issues.push({
      code: "INVALID_LOAD_ID",
      severity: "ERROR",
      message: "Load ID is required.",
      path: `${path}.loadId`,
      actual: load.loadId,
    });
  }

  if (
    !Number.isFinite(load.runningLoadW) ||
    load.runningLoadW < 0
  ) {
    issues.push({
      code: "INVALID_RUNNING_LOAD",
      severity: "ERROR",
      message:
        "Running load must be a finite value greater than or equal to zero.",
      path: `${path}.runningLoadW`,
      actual: load.runningLoadW,
    });
  }

  if (
    !Number.isFinite(load.operatingHoursPerDay) ||
    load.operatingHoursPerDay < 0 ||
    load.operatingHoursPerDay >
      ENERGY_DEFAULTS.maxOperatingHoursPerDay
  ) {
    issues.push({
      code: "INVALID_OPERATING_HOURS",
      severity: "ERROR",
      message:
        "Operating hours per day must be between 0 and 24.",
      path: `${path}.operatingHoursPerDay`,
      actual: load.operatingHoursPerDay,
    });
  }

  if (
    !Number.isFinite(load.operatingDaysPerMonth) ||
    load.operatingDaysPerMonth < 0 ||
    load.operatingDaysPerMonth >
      ENERGY_DEFAULTS.maxOperatingDaysPerMonth
  ) {
    issues.push({
      code: "INVALID_OPERATING_DAYS",
      severity: "ERROR",
      message:
        "Operating days per month must be between 0 and 31.",
      path: `${path}.operatingDaysPerMonth`,
      actual: load.operatingDaysPerMonth,
    });
  }

  return issues;
}

export function validateEnergy(
  input: EnergyInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  if (!input) {
    return [
      {
        code: "INVALID_INPUT",
        severity: "ERROR",
        message: "Energy input is required.",
        path: "",
      },
    ];
  }

  if (!Array.isArray(input.loads)) {
    return [
      {
        code: "INVALID_LOADS",
        severity: "ERROR",
        message: "Energy loads must be provided as an array.",
        path: "loads",
        actual: input.loads,
      },
    ];
  }

  if (input.loads.length === 0) {
    issues.push({
      code: "NO_LOADS",
      severity: "ERROR",
      message: "At least one energy load is required.",
      path: "loads",
      actual: input.loads,
    });
  }

  const loadIds = new Set<string>();

  input.loads.forEach((load, index) => {
    if (loadIds.has(load.loadId)) {
      issues.push({
        code: "DUPLICATE_LOAD_ID",
        severity: "ERROR",
        message:
          `Duplicate load ID "${load.loadId}".`,
        path: `loads[${index}].loadId`,
        actual: load.loadId,
      });
    }

    loadIds.add(load.loadId);

    issues.push(
      ...validateEnergyLoad(load, index),
    );
  });

  if (
    input.systemLossFactor !== undefined &&
    (
      !Number.isFinite(input.systemLossFactor) ||
      input.systemLossFactor < 0 ||
      input.systemLossFactor >= 1
    )
  ) {
    issues.push({
      code: "INVALID_SYSTEM_LOSS_FACTOR",
      severity: "ERROR",
      message:
        "System loss factor must be finite and greater than or equal to 0 and less than 1.",
      path: "systemLossFactor",
      actual: input.systemLossFactor,
    });
  }

  if (
    input.designMargin !== undefined &&
    (
      !Number.isFinite(input.designMargin) ||
      input.designMargin < 0 ||
      input.designMargin > 1
    )
  ) {
    issues.push({
      code: "INVALID_DESIGN_MARGIN",
      severity: "ERROR",
      message:
        "Design margin must be finite and between 0 and 1.",
      path: "designMargin",
      actual: input.designMargin,
    });
  }

  return issues;
}
