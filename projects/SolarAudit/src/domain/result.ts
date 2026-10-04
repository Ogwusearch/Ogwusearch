import type { CalculationResult } from "@ogwusearch/engineering-types";

export interface AuditCalculationResult {
  readonly auditId: string;
  readonly calculationName: string;
  readonly result: CalculationResult;
  readonly savedAt: string;
}
