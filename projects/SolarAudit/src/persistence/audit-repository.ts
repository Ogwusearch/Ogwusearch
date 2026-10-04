import type { SolarAudit } from "../domain/audit.js";

export interface AuditRepository {
  create(audit: SolarAudit): Promise<SolarAudit>;

  findById(
    auditId: string,
  ): Promise<SolarAudit | undefined>;

  save(audit: SolarAudit): Promise<SolarAudit>;
}
