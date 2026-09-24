import type { EngineeringIssue } from "./issue.js";

/**
 * A blocking engineering validation issue.
 *
 * An error means the calculation input or resulting design
 * cannot be considered valid until the issue is resolved.
 */
export interface EngineeringError
  extends EngineeringIssue {
  readonly severity: "ERROR";
}