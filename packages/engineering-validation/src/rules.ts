import type { ValidationIssue } from "./errors";

export interface EngineeringRule<T> {
  code: string;
  description: string;

  validate(
    input: T,
  ): ValidationIssue[];
}

export function createRule<T>(
  code: string,
  description: string,
  validate: (input: T) => ValidationIssue[],
): EngineeringRule<T> {
  return {
    code,
    description,
    validate,
  };
}