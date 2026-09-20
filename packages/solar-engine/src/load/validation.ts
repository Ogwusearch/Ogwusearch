import type {
  ValidationError,
  ValidationResult,
  ValidationWarning
} from "@ogwusearch/engineering-types";

import {
  LOAD_AUDIT_CONSTANTS as C
} from "./constants";

import type {
  LoadAuditInput,
  LoadItemInput
} from "./input";

function validateLoadItem(
  load: LoadItemInput,
  index: number
): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const field = (name: string) => `loads[${index}].${name}`;

  if (!load.appliance || load.appliance.trim().length === 0) {
    errors.push({
      severity: "error",
      code: "REQUIRED",
      field: field("appliance"),
      message: "Appliance name is required.",
      value: load.appliance
    });
  }

  if (!Number.isFinite(load.quantity)) {
    errors.push({
      severity: "error",
      code: "INVALID_NUMBER",
      field: field("quantity"),
      message: "Quantity must be a finite number.",
      value: load.quantity
    });
  } else if (
    load.quantity < C.MIN_QUANTITY ||
    load.quantity > C.MAX_QUANTITY
  ) {
    errors.push({
      severity: "error",
      code: "OUT_OF_RANGE",
      field: field("quantity"),
      message: `Quantity must be between ${C.MIN_QUANTITY} and ${C.MAX_QUANTITY}.`,
      value: load.quantity
    });
  }

  if (!Number.isFinite(load.ratedPowerW)) {
    errors.push({
      severity: "error",
      code: "INVALID_NUMBER",
      field: field("ratedPowerW"),
      message: "Rated power must be a finite number.",
      value: load.ratedPowerW
    });
  } else if (
    load.ratedPowerW < C.MIN_POWER_W ||
    load.ratedPowerW > C.MAX_POWER_W
  ) {
    errors.push({
      severity: "error",
      code: "OUT_OF_RANGE",
      field: field("ratedPowerW"),
      message: `Rated power must be between ${C.MIN_POWER_W} W and ${C.MAX_POWER_W} W.`,
      value: load.ratedPowerW
    });
  }

  if (!Number.isFinite(load.hoursPerDay)) {
    errors.push({
      severity: "error",
      code: "INVALID_NUMBER",
      field: field("hoursPerDay"),
      message: "Hours per day must be a finite number.",
      value: load.hoursPerDay
    });
  } else if (
    load.hoursPerDay < C.MIN_HOURS_PER_DAY ||
    load.hoursPerDay > C.MAX_HOURS_PER_DAY
  ) {
    errors.push({
      severity: "error",
      code: "OUT_OF_RANGE",
      field: field("hoursPerDay"),
      message: `Hours per day must be between ${C.MIN_HOURS_PER_DAY} and ${C.MAX_HOURS_PER_DAY}.`,
      value: load.hoursPerDay
    });
  }

  if (load.daysPerWeek !== undefined) {
    if (!Number.isFinite(load.daysPerWeek)) {
      errors.push({
      severity: "error",
        code: "INVALID_NUMBER",
        field: field("daysPerWeek"),
        message: "Days per week must be a finite number.",
        value: load.daysPerWeek
      });
    } else if (
      load.daysPerWeek < C.MIN_DAYS_PER_WEEK ||
      load.daysPerWeek > C.MAX_DAYS_PER_WEEK
    ) {
      errors.push({
      severity: "error",
        code: "OUT_OF_RANGE",
        field: field("daysPerWeek"),
        message: `Days per week must be between ${C.MIN_DAYS_PER_WEEK} and ${C.MAX_DAYS_PER_WEEK}.`,
        value: load.daysPerWeek
      });
    }
  }

  if (load.powerFactor !== undefined) {
    if (!Number.isFinite(load.powerFactor)) {
      errors.push({
      severity: "error",
        code: "INVALID_NUMBER",
        field: field("powerFactor"),
        message: "Power factor must be a finite number.",
        value: load.powerFactor
      });
    } else if (
      load.powerFactor < C.MIN_POWER_FACTOR ||
      load.powerFactor > C.MAX_POWER_FACTOR
    ) {
      errors.push({
      severity: "error",
        code: "OUT_OF_RANGE",
        field: field("powerFactor"),
        message: `Power factor must be between ${C.MIN_POWER_FACTOR} and ${C.MAX_POWER_FACTOR}.`,
        value: load.powerFactor
      });
    }
  }

  if (load.hoursPerDay > 16) {
    warnings.push({
      code: "HIGH_DAILY_RUNTIME",
      field: field("hoursPerDay"),
      message:
        "Daily operating time is high. Verify the appliance duty cycle.",
      value: load.hoursPerDay
    });
  }

  if (
    load.powerFactor !== undefined &&
    load.powerFactor < 0.8
  ) {
    warnings.push({
      code: "LOW_POWER_FACTOR",
      field: field("powerFactor"),
      message:
        "Low power factor may increase apparent power and affect inverter and cable sizing.",
      value: load.powerFactor
    });
  }

  return {
    errors,
    warnings
  };
}

export function validateLoadAudit(
  input: LoadAuditInput
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!Array.isArray(input.loads)) {
    errors.push({
      severity: "error",
      code: "INVALID_TYPE",
      field: "loads",
      message: "Loads must be an array.",
      value: input.loads
    });
  } else if (input.loads.length === 0) {
    errors.push({
      severity: "error",
      code: "EMPTY_LOAD_LIST",
      field: "loads",
      message: "At least one load is required.",
      value: input.loads
    });
  } else {
    input.loads.forEach((load, index) => {
      const result = validateLoadItem(load, index);

      errors.push(...result.errors);
      warnings.push(...result.warnings);
    });
  }

  if (!Number.isFinite(input.diversityFactor)) {
    errors.push({
      severity: "error",
      code: "INVALID_NUMBER",
      field: "diversityFactor",
      message: "Diversity factor must be a finite number.",
      value: input.diversityFactor
    });
  } else if (
    input.diversityFactor < C.MIN_DIVERSITY_FACTOR ||
    input.diversityFactor > C.MAX_DIVERSITY_FACTOR
  ) {
    errors.push({
      severity: "error",
      code: "OUT_OF_RANGE",
      field: "diversityFactor",
      message:
        `Diversity factor must be between ${C.MIN_DIVERSITY_FACTOR} and ${C.MAX_DIVERSITY_FACTOR}.`,
      value: input.diversityFactor
    });
  }

  if (!Number.isFinite(input.designMargin)) {
    errors.push({
      severity: "error",
      code: "INVALID_NUMBER",
      field: "designMargin",
      message: "Design margin must be a finite number.",
      value: input.designMargin
    });
  } else if (
    input.designMargin < C.MIN_DESIGN_MARGIN ||
    input.designMargin > C.MAX_DESIGN_MARGIN
  ) {
    errors.push({
      severity: "error",
      code: "OUT_OF_RANGE",
      field: "designMargin",
      message:
        `Design margin must be between ${C.MIN_DESIGN_MARGIN} and ${C.MAX_DESIGN_MARGIN}.`,
      value: input.designMargin
    });
  }

  if (input.diversityFactor === 1) {
    warnings.push({
      code: "NO_DIVERSITY_REDUCTION",
      field: "diversityFactor",
      message:
        "A diversity factor of 1.0 applies no diversity reduction.",
      value: input.diversityFactor
    });
  }

  if (input.designMargin === 0) {
    warnings.push({
      code: "NO_DESIGN_MARGIN",
      field: "designMargin",
      message:
        "No additional design margin has been applied.",
      value: input.designMargin
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}