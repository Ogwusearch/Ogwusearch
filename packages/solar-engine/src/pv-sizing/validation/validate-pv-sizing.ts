// ============================================================
// PV Sizing
// Input Validation
// ============================================================

import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type { ValidationResult } from "@ogwusearch/engineering-validation";

import type { PVSizingInput } from "../types/index.js";

import {
  dailyEnergyNumericRule,
  dailyEnergyPositiveRule,
  peakSunHoursNumericRule,
  peakSunHoursPositiveRule,
  systemEfficiencyNumericRule,
  systemEfficiencyRangeValidationRule,
  panelPowerNumericRule,
  panelPowerPositiveRule,
} from "./rules.js";

function runRule<T>(
  value: T,
  rule: {
    check: (
      value: T,
      context: {
        path?: string;
        data?: Record<string, unknown>;
      },
    ) => EngineeringIssue[];
  },
  path: string,
): EngineeringIssue[] {
  return rule.check(value, { path });
}

/**
 * Standardized validation API.
 *
 * Returns the raw engineering issues required by
 * engineering-core.executeCalculation().
 */
export function validatePVSizingIssues(
  input: PVSizingInput,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  // ----------------------------------------------------------
  // Daily Energy
  // ----------------------------------------------------------

  const dailyEnergyNumericIssues = runRule(
    input.dailyEnergyKWh,
    dailyEnergyNumericRule,
    "dailyEnergyKWh",
  );

  issues.push(...dailyEnergyNumericIssues);

  if (dailyEnergyNumericIssues.length === 0) {
    issues.push(
      ...runRule(
        input.dailyEnergyKWh,
        dailyEnergyPositiveRule,
        "dailyEnergyKWh",
      ),
    );
  }

  // ----------------------------------------------------------
  // Peak Sun Hours
  // ----------------------------------------------------------

  const peakSunHoursNumericIssues = runRule(
    input.peakSunHours,
    peakSunHoursNumericRule,
    "peakSunHours",
  );

  issues.push(...peakSunHoursNumericIssues);

  if (peakSunHoursNumericIssues.length === 0) {
    issues.push(
      ...runRule(
        input.peakSunHours,
        peakSunHoursPositiveRule,
        "peakSunHours",
      ),
    );
  }

  // ----------------------------------------------------------
  // System Efficiency
  // ----------------------------------------------------------

  const systemEfficiencyNumericIssues = runRule(
    input.systemEfficiency,
    systemEfficiencyNumericRule,
    "systemEfficiency",
  );

  issues.push(...systemEfficiencyNumericIssues);

  if (systemEfficiencyNumericIssues.length === 0) {
    issues.push(
      ...runRule(
        input.systemEfficiency,
        systemEfficiencyRangeValidationRule,
        "systemEfficiency",
      ),
    );
  }

  // ----------------------------------------------------------
  // Panel Power
  //
  // Optional field:
  // no validation is performed when undefined.
  // ----------------------------------------------------------

  if (input.panelPowerW !== undefined) {
    const panelPowerNumericIssues = runRule(
      input.panelPowerW,
      panelPowerNumericRule,
      "panelPowerW",
    );

    issues.push(...panelPowerNumericIssues);

    if (panelPowerNumericIssues.length === 0) {
      issues.push(
        ...runRule(
          input.panelPowerW,
          panelPowerPositiveRule,
          "panelPowerW",
        ),
      );
    }
  }

  return issues;
}

/**
 * Backward-compatible validation API.
 *
 * Preserves the existing ValidationResult contract used
 * by the legacy PV sizing validation tests and callers.
 */
export function validatePVSizingInput(
  input: PVSizingInput,
): ValidationResult {
  const issues = validatePVSizingIssues(input);

  const errors = issues.filter(
    (issue) => issue.severity === "ERROR",
  );

  const warnings = issues.filter(
    (issue) => issue.severity === "WARNING",
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    issues,
  };
}