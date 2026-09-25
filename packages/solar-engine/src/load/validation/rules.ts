
// ============================================================
// Solar Engine
// Load Validation Rules
// ============================================================

import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  Load,
} from "../types/load.js";

import {
  LOAD_LIMITS,
} from "../constants.js";

export function validateLoad(
  load: Load,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  // ----------------------------------------------------------
  // Identity
  // ----------------------------------------------------------

  if (!load.id.trim()) {
    issues.push({
      code: "EMPTY_LOAD_ID",
      severity: "ERROR",
      message: "Load ID cannot be empty.",
      path: "id",
    });
  }

  if (!load.name.trim()) {
    issues.push({
      code: "EMPTY_LOAD_NAME",
      severity: "ERROR",
      message: "Load name cannot be empty.",
      path: "name",
    });
  }

  // ----------------------------------------------------------
  // Quantity
  // ----------------------------------------------------------

  if (load.quantity <= 0) {
    issues.push({
      code: "INVALID_QUANTITY",
      severity: "ERROR",
      message:
        "Load quantity must be greater than zero.",
      path: "quantity",
      actual: load.quantity,
    });
  }

  // ----------------------------------------------------------
  // Rated Power
  // ----------------------------------------------------------

  if (load.ratedPowerW <= 0) {
    issues.push({
      code: "INVALID_RATED_POWER",
      severity: "ERROR",
      message:
        "Rated power must be greater than zero.",
      path: "ratedPowerW",
      actual: load.ratedPowerW,
    });
  }

  // ----------------------------------------------------------
  // Power Factor
  // ----------------------------------------------------------

  if (
    load.powerFactor <=
      LOAD_LIMITS.minimumPowerFactor ||
    load.powerFactor >
      LOAD_LIMITS.maximumPowerFactor
  ) {
    issues.push({
      code: "INVALID_POWER_FACTOR",
      severity: "ERROR",
      message:
        "Power factor must be greater than 0 and no greater than 1.",
      path: "powerFactor",
      actual: load.powerFactor,
    });
  }

  if (load.powerFactor < 0.8) {
    issues.push({
      code: "LOW_POWER_FACTOR",
      severity: "WARNING",
      message:
        "Load power factor is below 0.80.",
      path: "powerFactor",
      actual: load.powerFactor,
    });
  }

  // ----------------------------------------------------------
  // Efficiency
  // ----------------------------------------------------------

  if (
    load.efficiency !== undefined &&
    (
      load.efficiency <= 0 ||
      load.efficiency > 1
    )
  ) {
    issues.push({
      code: "INVALID_EFFICIENCY",
      severity: "ERROR",
      message:
        "Efficiency must be greater than 0 and no greater than 1.",
      path: "efficiency",
      actual: load.efficiency,
    });
  }

  // ----------------------------------------------------------
  // Operating Hours
  // ----------------------------------------------------------

  if (
    load.operatingHoursPerDay < 0 ||
    load.operatingHoursPerDay >
      LOAD_LIMITS.maximumOperatingHoursPerDay
  ) {
    issues.push({
      code: "INVALID_OPERATING_HOURS",
      severity: "ERROR",
      message:
        "Operating hours must be between 0 and 24 hours per day.",
      path: "operatingHoursPerDay",
      actual: load.operatingHoursPerDay,
    });
  }

  // ----------------------------------------------------------
  // Operating Days
  // ----------------------------------------------------------

  if (
    load.operatingDaysPerMonth < 0 ||
    load.operatingDaysPerMonth >
      LOAD_LIMITS.maximumOperatingDaysPerMonth
  ) {
    issues.push({
      code: "INVALID_OPERATING_DAYS",
      severity: "ERROR",
      message:
        "Operating days must be between 0 and 31 days per month.",
      path: "operatingDaysPerMonth",
      actual: load.operatingDaysPerMonth,
    });
  }

  // ----------------------------------------------------------
  // Demand Factor
  // ----------------------------------------------------------

  if (
    load.demandFactor !== undefined &&
    (
      load.demandFactor <= 0 ||
      load.demandFactor > 1
    )
  ) {
    issues.push({
      code: "INVALID_DEMAND_FACTOR",
      severity: "ERROR",
      message:
        "Demand factor must be greater than 0 and no greater than 1.",
      path: "demandFactor",
      actual: load.demandFactor,
    });
  }

  // ----------------------------------------------------------
  // Diversity Factor
  // ----------------------------------------------------------

  if (
    load.diversityFactor !== undefined &&
    load.diversityFactor < 1
  ) {
    issues.push({
      code: "INVALID_DIVERSITY_FACTOR",
      severity: "ERROR",
      message:
        "Diversity factor must be at least 1.",
      path: "diversityFactor",
      actual: load.diversityFactor,
    });
  }

  return issues;
}
