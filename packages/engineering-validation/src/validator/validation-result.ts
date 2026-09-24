import type { EngineeringIssue } from "@ogwusearch/engineering-types";

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: EngineeringIssue[];
  readonly warnings: EngineeringIssue[];
  readonly issues: EngineeringIssue[];
}