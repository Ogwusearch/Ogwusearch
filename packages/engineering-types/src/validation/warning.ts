import type { EngineeringIssue } from "./issue.js";

/**
 * A non-blocking engineering validation issue.
 *
 * A warning means the calculation may still be valid,
 * but the condition should be reviewed.
 */
export interface EngineeringWarning
  extends EngineeringIssue {
  readonly severity: "WARNING";
}