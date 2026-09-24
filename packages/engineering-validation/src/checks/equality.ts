import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

export function equality<T>(expected: T): ValidationRule<T> {
  return {
    code: "EQUALITY",
    description: "Value must match the expected value.",

    check(
      value: T,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (Object.is(value, expected)) {
        return [];
      }

      return [
        {
          code: "EQUALITY",
          message: "Value does not match the expected value.",
          severity: "ERROR",
          ...(context.path !== undefined && {
            path: context.path,
          }),
          metadata: {
            extras: {
              expected,
              received: value,
            },
          },
        },
      ];
    },
  };
}