import type { EngineeringIssue } from "@ogwusearch/engineering-types";
import type {
  ValidationRule,
  ValidationRuleContext,
} from "../rule/rule.js";

export function range(
  min: number,
  max: number,
): ValidationRule<number> {
  if (!Number.isFinite(min)) {
    throw new Error("range() requires a finite minimum value.");
  }

  if (!Number.isFinite(max)) {
    throw new Error("range() requires a finite maximum value.");
  }

  if (min > max) {
    throw new Error("range() requires min to be less than or equal to max.");
  }

  return {
    code: "RANGE",
    description: `Value must be between ${min} and ${max}.`,

    check(
      value: number,
      context: ValidationRuleContext,
    ): EngineeringIssue[] {
      if (!Number.isFinite(value)) {
        return [];
      }

      if (value >= min && value <= max) {
        return [];
      }

      const issue: EngineeringIssue = {
        code: "RANGE",
        message: `Value must be between ${min} and ${max}.`,
        severity: "ERROR",
        ...(context.path !== undefined && {
          path: context.path,
        }),
        metadata: {
          extras: {
            min,
            max,
            actual: value,
          },
        },
      };

      return [issue];
    },
  };
}