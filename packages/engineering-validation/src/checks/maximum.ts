import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

export function maximum(max: number): ValidationRule<number> {
  if (!Number.isFinite(max)) {
    throw new Error("maximum() requires a finite maximum value.");
  }

  return {
    code: "MAXIMUM",
    description: `Value must be less than or equal to ${max}.`,

    check(
      value: number,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (!Number.isFinite(value)) {
        return [];
      }

      if (value <= max) {
        return [];
      }

      const issue: EngineeringIssue = {
        code: "MAXIMUM",
        message: `Value must be less than or equal to ${max}.`,
        severity: "ERROR",
        ...(context.path !== undefined && {
          path: context.path,
        }),
        metadata: {
          extras: {
            maximum: max,
            actual: value,
          },
        },
      };

      return [issue];
    },
  };
}