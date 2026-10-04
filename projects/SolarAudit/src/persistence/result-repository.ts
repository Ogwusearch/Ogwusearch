import type { AuditCalculationResult } from "../domain/result.js";

export interface ResultRepository {
  save(
    result: AuditCalculationResult,
  ): Promise<AuditCalculationResult>;

  findByAuditId(
    auditId: string,
  ): Promise<readonly AuditCalculationResult[]>;
}
