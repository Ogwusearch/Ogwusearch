 /**
  * Solar-engineering warning utilities.
  *
  * This module exposes stable warning identifiers, severity
  * classification, and warning construction helpers.
  */

export type {
  WarningCode,
} from "./warning-codes.js";

export {
  WARNING_CODES,
} from "./warning-codes.js";

export type {
  WarningSeverity,
} from "./warning-severity.js";

export {
  WARNING_SEVERITY_LEVEL,
  compareWarningSeverity,
  maxWarningSeverity,
} from "./warning-severity.js";

export type {
  CreateWarningInput,
} from "./create-warning.js";

export {
  createWarning,
} from "./create-warning.js";