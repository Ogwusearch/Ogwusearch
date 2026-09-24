import type { EngineeringIssue } from "@ogwusearch/engineering-types";

export interface ValidationRule<T> {
  readonly code: string;
  readonly description: string;

  check(
    value: T,
    context: ValidationRuleContext,
  ): EngineeringIssue[];
}

export interface ValidationRuleContext {
  readonly path?: string;
  readonly data?: Record<string, unknown>;
}