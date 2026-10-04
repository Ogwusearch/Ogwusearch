import type { AuditCalculationResult } from "../../../domain/result.js";
import type { ResultRepository } from "../../../persistence/result-repository.js";

export class MemoryResultRepository
  implements ResultRepository
{
  private readonly results =
    new Map<string, AuditCalculationResult>();

  async save(
    result: AuditCalculationResult,
  ): Promise<AuditCalculationResult> {
    const key = this.createKey(result);

    this.results.set(key, result);

    return result;
  }

  async findByAuditId(
    auditId: string,
  ): Promise<readonly AuditCalculationResult[]> {
    return Array.from(this.results.values()).filter(
      (result) => result.auditId === auditId,
    );
  }

  private createKey(
    result: AuditCalculationResult,
  ): string {
    return `${result.auditId}:${result.calculationName}`;
  }
}
