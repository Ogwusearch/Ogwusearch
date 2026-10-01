import type {
  EngineeringMetadata,
  EngineeringWarning,
} from "@ogwusearch/engineering-types";

import type { WarningCode } from "./warning-codes.js";
import type { WarningSeverity } from "./warning-severity.js";

/**
 * Input used to construct a solar-engineering warning.
 */
export interface CreateWarningInput {
  /**
   * Stable solar-engineering warning identifier.
   */
  readonly code: WarningCode;

  /**
   * Detailed solar-domain warning severity.
   */
  readonly severity: WarningSeverity;

  /**
   * Human-readable explanation.
   */
  readonly message: string;

  /**
   * Optional calculation category.
   */
  readonly category?: string;

  /**
   * Optional source domain or calculation module.
   */
  readonly source?: string;

  /**
   * Optional additional engineering metadata.
   */
  readonly metadata?: EngineeringMetadata;
}

/**
 * Creates an immutable solar-engineering warning.
 *
 * The generic engineering contract uses `"WARNING"` as its
 * severity discriminator. The more detailed solar severity
 * is preserved in metadata.
 */
export function createWarning(
  input: CreateWarningInput,
): EngineeringWarning {
  const metadata: Record<string, unknown> = {
    ...(input.metadata ?? {}),
    solarWarningSeverity: input.severity,

    ...(input.category !== undefined
      ? { category: input.category }
      : {}),

    ...(input.source !== undefined
      ? { source: input.source }
      : {}),
  };

  const warning: EngineeringWarning = {
    code: input.code,
    severity: "WARNING",
    message: input.message,
    metadata: Object.freeze(metadata),
  };

  return Object.freeze(warning);
}