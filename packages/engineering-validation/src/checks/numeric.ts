import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

export function numeric(
  code = "VALUE_NOT_NUMERIC",
): ValidationRule<unknown> {
  return {
    code,
    description: "Value must be a finite number.",

    check(
      value: unknown,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value)
      ) {
        return [
          {
            code,
            severity: "ERROR",
            message: `${context.path ?? "Value"} must be a finite number.`,
            path: context.path,
          },
        ];
      }

      return [];
    },
  };
}