import type { SolarAudit } from "../../../domain/audit.js";
import type { AuditRepository } from "../../../persistence/audit-repository.js";

export class MemoryAuditRepository
  implements AuditRepository
{
  private readonly audits =
    new Map<string, SolarAudit>();

  async create(
    audit: SolarAudit,
  ): Promise<SolarAudit> {
    this.audits.set(audit.id, audit);

    return audit;
  }

  async findById(
    auditId: string,
  ): Promise<SolarAudit | undefined> {
    return this.audits.get(auditId);
  }

  async save(
    audit: SolarAudit,
  ): Promise<SolarAudit> {
    this.audits.set(audit.id, audit);

    return audit;
  }
}
