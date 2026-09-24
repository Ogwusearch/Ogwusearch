// ============================================================
// @ogwusearch/engineering-types
// Public API
// ============================================================

// Calculation
export type {
  CalculationInput,
} from "./calculation/input.js";

export type {
  CalculationOutput,
} from "./calculation/output.js";

export type {
  CalculationResult,
} from "./calculation/result.js";

export type {
  CalculationStatus,
} from "./calculation/status.js";

export type {
  CalculationContext,
} from "./calculation/context.js";

// Validation
export type {
  EngineeringIssue,
  IssueSeverity,
} from "./validation/issue.js";

export type {
  EngineeringError,
} from "./validation/error.js";

export type {
  EngineeringWarning,
} from "./validation/warning.js";

// Trace
export type {
  CalculationTraceStep,
} from "./trace/step.js";

export type {
  CalculationTrace,
} from "./trace/trace.js";

// Assumptions
export type {
  EngineeringAssumption,
} from "./assumptions/assumption.js";

// Common
export type {
  EngineeringMetadata,
} from "./common/metadata.js";

export type {
  EngineeringId,
} from "./common/identifier.js";