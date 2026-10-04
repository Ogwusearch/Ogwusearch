import type {
  AuditCalculationResult,
} from "../../domain/result.js";

import type {
  ResultRepository,
} from "../../persistence/index.js";

export interface GetAuditResultsDependencies {
  readonly results: ResultRepository;
}

export async function getAuditResults(
  auditId: string,
  dependencies: GetAuditResultsDependencies,
): Promise<readonly AuditCalculationResult[]> {
  return dependencies.results.findByAuditId(
    auditId,
  );
}