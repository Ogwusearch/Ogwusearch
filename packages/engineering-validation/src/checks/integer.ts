




import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

/**
 * Validates that a numeric value is a finite integer.
 *
 * Non-finite values are ignored here and should be handled
 * by a dedicated numeric/finite validation rule.
 */
export function integer(): ValidationRule<number> {
  return {
    code: "INTEGER",
    description: "Value must be an integer.",

    check(
      value: number,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (!Number.isFinite(value)) {
        return [];
      }

      if (Number.isInteger(value)) {
        return [];
      }

      return [
        {
          code: "INTEGER",
          message: "Value must be an integer.",
          severity: "ERROR",
          ...(context.path !== undefined && {
            path: context.path,
          }),
          metadata: {
            extras: {
              expected: "integer",
              received: value,
            },
          },
        },
      ];
    },
  };
}