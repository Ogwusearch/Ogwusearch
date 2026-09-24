import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

export function validate<T>(
  value: T,
  rules: readonly ValidationRule<T>[],
  context: ValidationRuleContext,
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  for (const rule of rules) {
    const ruleIssues = rule.check(value, context);
    issues.push(...ruleIssues);
  }

  return issues;
}