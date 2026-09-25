// ============================================================
// Load Audit Definition
// ============================================================

import type { LoadAuditInput } from "./load-input.js";
import type { LoadAuditOutput } from "./load-output.js";

export interface LoadAudit {
  readonly input: LoadAuditInput;
  readonly output?: LoadAuditOutput;
}