import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

export function minimum(min: number): ValidationRule<number> {
  if (!Number.isFinite(min)) {
    throw new Error("minimum() requires a finite minimum value.");
  }

  return {
    code: "MINIMUM",
    description: `Value must be greater than or equal to ${min}.`,

    check(
      value: number,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (!Number.isFinite(value)) {
        return [];
      }

      if (value >= min) {
        return [];
      }

      const issue: EngineeringIssue = {
        code: "MINIMUM",
        message: `Value must be greater than or equal to ${min}.`,
        severity: "ERROR",
        ...(context.path !== undefined && {
          path: context.path,
        }),
        metadata: {
          extras: {
            minimum: min,
            actual: value,
          },
        },
      };

      return [issue];
    },
  };
}