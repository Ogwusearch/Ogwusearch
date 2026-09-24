import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

export function positive(
  code = "VALUE_MUST_BE_POSITIVE",
): ValidationRule<number> {
  return {
    code,
    description: "Value must be greater than zero.",

    check(
      value: number,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (value <= 0) {
        return [
          {
            code,
            severity: "ERROR",
            message: `${context.path ?? "Value"} must be greater than zero.`,
            path: context.path,
          },
        ];
      }

      return [];
    },
  };
}