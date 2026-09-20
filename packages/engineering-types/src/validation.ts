export interface ValidationError {
  code: string;
  field: string;
  message: string;
  severity: "error";
  value?: unknown;
}

export interface ValidationWarning {
  code: string;
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}