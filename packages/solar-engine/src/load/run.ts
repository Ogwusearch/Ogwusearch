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
    input.designMargin !== undefined &&
    (
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
      module: "@ogwusearch/solar-engine",
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