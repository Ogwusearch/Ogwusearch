export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  code: string;
  field: string;
  message: string;
  severity: ValidationSeverity;
  value?: unknown;
  expected?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export function createValidationResult(
  issues: ValidationIssue[],
): ValidationResult {
  const errors = issues.filter(
    (issue) => issue.severity === "error",
  );

  const warnings = issues.filter(
    (issue) => issue.severity === "warning",
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}