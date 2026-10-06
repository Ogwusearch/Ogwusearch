// ============================================================
// Load Audit Runner
// ============================================================

import {
  executeCalculation,
  defineCalculation,
} from "@ogwusearch/engineering-core";

import type {
  CalculationResult,
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

import type {
  LoadAuditInput,
  LoadAuditOutput,
} from "./types/index.js";

import {
  validateLoadList,
} from "./validation/index.js";

import {
  calculateLoadAudit,
} from "./calculation.js";

import {
  createLoadAssumptions,
} from "./assumptions/index.js";

import {
  createLoadTrace,
} from "./trace/load-trace.js";

import {
  LOAD_DEFAULTS,
} from "./constants.js";

const DEFAULT_DIVERSITY_FACTOR = 1;

// ============================================================
// Validation
// ============================================================

function validateLoadAuditInput(
  input: LoadAuditInput,
): EngineeringIssue[] {
  const issues = validateLoadList(
    input.loads,
  );

  if (
    input.diversityFactor !== undefined &&
    (
      !Number.isFinite(input.diversityFactor) ||
      input.diversityFactor < 1
    )
  ) {
    issues.push({
      code: "INVALID_DIVERSITY_FACTOR",
      severity: "ERROR",
      message:
        "Diversity factor must be a finite number greater than or equal to 1.",
      path: "diversityFactor",
      actual: input.diversityFactor,
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
        "Design margin must be between 0 and 1.",
      path: "designMargin",
      actual: input.designMargin,
    });
  }

  return issues;
}

// ============================================================
// Load Audit Definition
// ============================================================

const loadAuditDefinition =
  defineCalculation<
    LoadAuditInput,
    LoadAuditOutput
  >({
    name: "Load Audit",

    validate: validateLoadAuditInput,

    assumptions: (input) =>
      createLoadAssumptions(
        input.designMargin ??
          LOAD_DEFAULTS.designMargin,

        input.diversityFactor ??
          DEFAULT_DIVERSITY_FACTOR,
      ),

    calculate: calculateLoadAudit,
  });

// ============================================================
// Load Audit Runner
// ============================================================

export function runLoadAudit(
  input: LoadAuditInput,
): CalculationResult<LoadAuditOutput> {
  const result =
    executeCalculation(
      loadAuditDefinition,
      input,
    );

  return {
    ...result,

    metadata: {
      ...result.metadata,
      module: "@ogwusearch/load-engine",
      version: "0.1.0",
      name: "Load Audit",
      extras: {
        ...result.metadata?.extras,
        domain: "load-audit",
      },
    },

    trace: {
      ...result.trace,
      steps: createLoadTrace(),
    },
  };
}