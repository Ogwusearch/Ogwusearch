import type {
  EngineeringError,
  EngineeringIssue,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

export interface ValidationContext {
  readonly issues: EngineeringIssue[];
  readonly errors: EngineeringError[];
  readonly warnings: EngineeringWarning[];
}

export function createValidationContext(): ValidationContext {
  return {
    issues: [],
    errors: [],
    warnings: [],
  };
}
