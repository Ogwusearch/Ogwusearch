import type { CalculationResult } from "@ogwusearch/engineering-types";

import type { AuditCalculationResult } from "../../domain/result.js";
import type { ResultRepository } from "../../persistence/index.js";

export interface SaveResultInput {
  readonly auditId: string;
  readonly calculationName: string;
  readonly result: CalculationResult;
}

export interface SaveResultDependencies {
  readonly results: ResultRepository;
  readonly now?: () => string;
}

export async function saveResult(
  input: SaveResultInput,
  dependencies: SaveResultDependencies,
): Promise<AuditCalculationResult> {
  const saved: AuditCalculationResult = {
    auditId: input.auditId,
    calculationName: input.calculationName,
    result: input.result,
    savedAt:
      dependencies.now?.() ??
      new Date().toISOString(),
  };

  return dependencies.results.save(saved);
}
