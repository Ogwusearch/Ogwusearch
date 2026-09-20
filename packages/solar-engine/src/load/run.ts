import type {
  EngineeringMetadata,
  EngineeringResult
} from "@ogwusearch/engineering-types";

import type { LoadAuditInput } from "./input";
import type { LoadAuditResult } from "./result";

import { validateLoadAudit } from "./validation";
import { calculateLoadAudit } from "./calculation";

const ENGINE_VERSION = "0.1.0";
const CALCULATION_VERSION = "0.1.0";
const MODULE_VERSION = "0.1.0";

export function runLoadAudit(
  input: LoadAuditInput
): EngineeringResult<LoadAuditResult> {
  const validation =
    validateLoadAudit(input);

  const metadata: EngineeringMetadata = {
    engineVersion: ENGINE_VERSION,
    calculationVersion: CALCULATION_VERSION,
    moduleVersion: MODULE_VERSION,
    calculatedAt:
      new Date().toISOString()
  };

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      warnings: validation.warnings,
      metadata
    };
  }

  const calculation =
    calculateLoadAudit(input);

  return {
    success: true,
    value: calculation.value,
    errors: [],
    warnings: validation.warnings,
    trace: calculation.trace,
    metadata
  };
}