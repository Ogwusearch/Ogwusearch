// ============================================================
// Load Audit Input
// ============================================================

import type { Load } from "./load.js";

export interface LoadAuditInput {
  readonly loads: readonly Load[];

  /**
   * Optional design margin applied to demand.
   *
   * Example:
   * 0.20 = 20% design margin.
   */
  readonly designMargin?: number;
}