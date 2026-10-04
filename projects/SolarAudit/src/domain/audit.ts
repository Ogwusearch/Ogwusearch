export type AuditStatus =
  | "DRAFT"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface SolarAudit {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly status: AuditStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}
