import type {
  EngineeringIssue,
} from "@ogwusearch/engineering-types";

export function hasValidationErrors(
  issues: readonly EngineeringIssue[],
): boolean {
  return issues.some(
    (issue) => issue.severity === "ERROR",
  );
}
