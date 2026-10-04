export type TelemetryEventType =
  | "project_created"
  | "audit_created"
  | "audit_started"
  | "audit_completed"
  | "audit_failed"
  | "calculation_started"
  | "calculation_completed"
  | "calculation_failed"
  | "test_passed"
  | "test_failed"
  | "build_completed"
  | "report_generated"
  | "page_view";

export interface TelemetryEvent<
  TData extends Record<string, unknown> =
    Record<string, unknown>,
> {
  readonly id: string;
  readonly type: TelemetryEventType;
  readonly timestamp: string;
  readonly project?: string;
  readonly data: TData;
}
