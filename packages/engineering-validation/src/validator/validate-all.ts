import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type { ValidationRule } from "../rule/rule.js";
import type { ValidationResult } from "./validation-result.js";

export function validateAll<T>(
  value: T,
  rules: readonly ValidationRule<T>[],
  context: {
    path?: string;
    data?: Record<string, unknown>;
  } = {},
): ValidationResult {
  const issues: EngineeringIssue[] = [];

  for (const rule of rules) {
    const ruleIssues = rule.check(value, context);
    issues.push(...ruleIssues);
  }

  const errors = issues.filter(
    (issue) => issue.severity === "ERROR",
  );

  const warnings = issues.filter(
    (issue) => issue.severity === "WARNING",
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    issues,
  };
}