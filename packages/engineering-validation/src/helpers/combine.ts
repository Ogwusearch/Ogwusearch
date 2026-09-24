import type { EngineeringIssue } from "@ogwusearch/engineering-types";

export function combineIssues(
  ...collections: ReadonlyArray<ReadonlyArray<EngineeringIssue>>
): EngineeringIssue[] {
  const issues: EngineeringIssue[] = [];

  for (const collection of collections) {
    issues.push(...collection);
  }

  return issues;
}