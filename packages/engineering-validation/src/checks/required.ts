import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

export function required<T>(
  code = "VALUE_REQUIRED",
): ValidationRule<T | null | undefined> {
  return {
    code,
    description: "Value must be provided.",

    check(
      value: T | null | undefined,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (value === null || value === undefined) {
        return [
          {
            code,
            severity: "ERROR",
            message: `${context.path ?? "Value"} is required.`,
            path: context.path,
          },
        ];
      }

      return [];
    },
  };
}